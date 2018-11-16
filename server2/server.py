from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from notification import FCMNotifier, NotificationTimer
from collection_day_checker import todayIsCollectionDay, tomorrowIsCollectionDay
from datetime import datetime as dt
import numpy as np, datetime, json, os

AMOUNT_THRESHOLD = 3
SMELL_THRESHOLD = 500
BASE_URL = 'https://sugoigomibako.herokuapp.com/'

app = Flask(__name__)
db = SQLAlchemy(app)
session = db.session
db_url = os.environ.get('DATABASE_URL') or "sqlite:///" + os.path.join(app.root_path, 'gomibako.db')
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['JSON_AS_ASCII'] = False

FCM_API_KEY = os.environ.get('FCM_API_KEY') 
notifier = FCMNotifier(FCM_API_KEY) if FCM_API_KEY else None
ntimer = NotificationTimer(BASE_URL)

class Amount(db.Model):
    recorded = db.Column('recorded', db.DateTime(), primary_key=True, default=dt.now)
    amount = db.Column('amount', db.Integer(), default='0', nullable=False)

    def __init__(self, amount):
        self.amount = amount

    def add(self):
        session.add(self)
        session.commit()
        return self.amount
    
    @classmethod
    def latest(cls, limit=1):
        rows = cls.query.order_by(desc(cls.recorded)).limit(limit).all()
        return [{'recorded': row.recorded, 'amount': row.amount} for row in rows]
    
    @classmethod
    def total_this_month(cls):
        now = dt.now()
        this_month = datetime.date(now.year, now.month, 1)
        rows = cls.query.filter(cls.recorded > this_month).all()
        if not rows: return 0
        rows = np.array([amount.amount for amount in rows])
        zero_idx = np.where(rows == 0)[0]
        if len(zero_idx) == 0: return rows[-1]
        if zero_idx[0] == 0: zero_idx = zero_idx[1:]
        return rows[zero_idx-1].sum() + rows[-1]

class Smell(db.Model):
    recorded = db.Column('recorded', db.DateTime(), primary_key=True, default=dt.now)
    smell = db.Column('smell', db.Integer(), default='0', nullable=False)

    def __init__(self, smell):
        self.smell = smell

    def add(self):
        session.add(self)
        session.commit()
        return self.smell
    
    @classmethod
    def latest(cls, limit=1):
        rows = cls.query.order_by(desc(cls.recorded)).limit(limit).all()
        return [{'recorded': row.recorded, 'smell': row.smell} for row in rows]

class Config(db.Model):
    lineup = ['name', 'nth', 'weekday', 'notification', 'time']
    configs = None
    name = db.Column(lineup[0], db.String(20), primary_key=True, default="普通ゴミ")
    nth = db.Column(lineup[1], db.String(10), nullable=True)
    weekday = db.Column(lineup[2], db.String(10), nullable=True)
    notification = db.Column(lineup[3], db.String(1), default="1")
    time = db.Column(lineup[4], db.String(5), default="07:00")

    def __init__(self, configs):
        self.configs = configs
        for key in configs.keys():
            setattr(self, key, configs[key])
        if not self.query.first():
            session.add(self)
            session.commit()
        
    def change(self):
        config = self.query.first()
        for key in self.configs: 
            setattr(config, key, getattr(self, key))
        session.commit()

    @classmethod
    def get(cls):
        row = cls.query.first()
        if not row: return
        config = {}
        for key in cls.lineup: config[key] = getattr(row, key)
        return config

class Token(db.Model):
    token = db.Column('token', db.String(), primary_key=True)

    def __init__(self, token):
        self.token = token
        if not self.query.first():
            session.add(self)
            session.commit()
    
    def change(self):
        token = self.query.first()
        token.token = self.token
        session.commit()
     
    @classmethod
    def get(cls):         
        row = cls.query.first()
        return row.token if row else None
        
@app.route('/')
def index():
    msg = 'すごいゴミ箱のAPIです．'

    if os.environ.get('RESET_DB_BY_INIT') == '1':
        print('reset DB', db.drop_all())
        msg = 'DBを初期化しました．'
    
    db.create_all()

    if notifier: 
        notifier.set_token(Token.get())
    config = Config.get()
    if config:
        if notifier: notifier.set_name(config['name'])
        ntimer.set_time(config['time']).start()

    return jsonify({'Init Server': msg})

@app.route('/amount', methods=['GET', 'POST'])
def amount():
    if request.method == 'GET':
        response = jsonify(Amount.latest(request.args.get('limit') or 1))
    elif request.method == 'POST':
        response = jsonify({'registered amount': Amount(request.form['amount']).add()})
    return response

@app.route('/amount/total')
def amount_total():
    return jsonify(int(Amount.total_this_month()))

@app.route('/smell', methods=['GET', 'POST'])
def smell():
    if request.method == 'GET':
        response = jsonify(Smell.latest(request.args.get('limit') or 1))
    elif request.method == 'POST':
        response = jsonify({'registered smell': Smell(request.form['smell']).add()})
        config = Config.get()
        if not notifier or not config or not config['notification']: return response
        if Smell.latest()[0]['smell'] >= SMELL_THRESHOLD: notifier.smell()
    return response

@app.route('/config', methods=['GET', 'POST'])
def config(): 
    if request.method == 'GET':
        response = jsonify(Config.get() or "no config")
    elif request.method == 'POST':        
        Config(request.form).change()
        if notifier and 'name' in request.form.keys(): notifier.set_name(request.form['name'])
        if ntimer and 'time' in request.form.keys(): 
            ntimer.set_time(request.form['time']).start()
        response = jsonify({'registered config': Config.get()})
    return response

@app.route('/token', methods=['GET', 'POST'])
def token():
    if request.method == 'GET':
        response = jsonify(Token.get() or "no token")
    if request.method == 'POST':
        Token(request.form['token']).change()
        if notifier: notifier.set_token(Token.get())
        response = jsonify('registered token')
    return response

@app.route('/notify')
def notify():
    response = jsonify("no notification")
    config = Config.get()
    if not config: return response
    name, nth, weekday, notification, _ = config.values()
    if notifier and notification and Amount.latest() and Amount.latest()[0]['amount'] >= AMOUNT_THRESHOLD:
        if todayIsCollectionDay(nth, weekday):
            notifier.today()
            response = jsonify("notify for today")
        if tomorrowIsCollectionDay(nth, weekday):
            notifier.tomorrow()
            response = jsonify("notify for tomorrow")
    return response

@app.route('/notify/test')
def test_notify():
    if notifier and Token.get():
        msg = request.args.get('msg') or "これはテスト通知です．"
        notifier.notify(msg)
        response = jsonify({'msg': msg, 'API_KEY': FCM_API_KEY, 'token': Token.get()})
    else:
        response = jsonify('no notification')
    return response

if __name__ == '__main__':
    app.run()