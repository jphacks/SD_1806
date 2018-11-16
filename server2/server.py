from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from notification import FCMNotifier, NotificationTimer
from collection_day_checker import todayIsCollectionDay, tomorrowIsCollectionDay
from datetime import datetime as dt
import numpy as np, datetime, json, os


DEBUG = True

AMOUNT_THRESHOLD = 3
SMELL_THRESHOLD = 500

BASE_URL = os.environ.get('BASE_URL')
FCM_API_KEY = os.environ.get('FCM_API_KEY') 
DB_FILE = 'gomibako.db'

app = Flask(__name__)
app.debug = DEBUG

db = SQLAlchemy(app)
session = db.session

db_url = os.environ.get('DATABASE_URL') or "sqlite:///" + os.path.join(app.root_path, DB_FILE)
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['JSON_AS_ASCII'] = False

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
    def latest(cls, limit=None):
        rows = cls.query.order_by(desc(cls.recorded)).limit(limit or 1).all()
        amounts = [{'recorded': row.recorded, 'amount': row.amount} for row in rows]

        return amounts
    
    @classmethod
    def total_this_month(cls):
        now = dt.now()
        this_month = datetime.date(now.year, now.month, 1)

        rows = cls.query.filter(cls.recorded > this_month).all()
        rows = np.array([amount.amount for amount in rows])

        zero_idx = np.where(rows == 0)[0]
        full_idx = zero_idx[zero_idx != 0] - 1

        total = rows[full_idx].sum() + rows[-1]
        
        return int(total)



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
    def latest(cls, limit=None):
        rows = cls.query.order_by(desc(cls.recorded)).limit(limit or 1).all()
        smells = [{'recorded': row.recorded, 'smell': row.smell} for row in rows]

        return smells



class Config(db.Model):
    lineup = ['name', 'nth', 'weekday', 'notification', 'time']

    name = db.Column(lineup[0], db.String(20), primary_key=True, default="普通ゴミ")
    nth = db.Column(lineup[1], db.String(10))
    weekday = db.Column(lineup[2], db.String(10))
    notification = db.Column(lineup[3], db.String(1), default="1")
    time = db.Column(lineup[4], db.String(5), default="07:00")

    def __init__(self, configs):
        self.configs = configs
        
        for key in configs.keys():
            setattr(self, key, configs[key])
        
    def change(self):
        config = self.query.first()

        if config:
            for key in self.configs: 
                setattr(config, key, getattr(self, key))
        else: 
            session.add(self)
        
        session.commit()

        return Config.get()

    @classmethod
    def get(cls):
        row = cls.query.first()
        if not row: return None

        config = {}
        for key in cls.lineup: 
            config[key] = getattr(row, key)
        
        return config



class Token(db.Model):
    token = db.Column('token', db.String(), primary_key=True)

    def __init__(self, token):
        self.token = token
    
    def change(self):
        token = self.query.first()

        if token: 
            token.token = self.token
        else: 
            session.add(self)

        session.commit()

        return self.token
     
    @classmethod
    def get(cls):         
        row = cls.query.first()
 
        return row.token if row else None





@app.route('/')
def index():
    return jsonify('すごいゴミ箱のAPIです．')



@app.route('/amount', methods=['GET', 'POST'])
def amount():
    if request.method == 'GET':
        limit = request.args.get('limit')
        response = jsonify(Amount.latest(limit))

    if request.method == 'POST':
        amount = int(request.form['amount'])
        response = jsonify({'registered amount': Amount(amount).add()})
    
    return response



@app.route('/amount/total')
def amount_total():
    return jsonify(Amount.total_this_month())



@app.route('/smell', methods=['GET', 'POST'])
def smell():
    if request.method == 'GET':
        limit = request.args.get('limit')
        response = jsonify(Smell.latest(limit))

    if request.method == 'POST':
        smell = int(request.form['smell'])
        response = jsonify({'registered smell': Smell(smell).add()})

        if notifier and smell >= SMELL_THRESHOLD: 
            notifier.smell()
    
    return response



@app.route('/config', methods=['GET', 'POST'])
def config(): 
    if request.method == 'GET':
        response = jsonify(Config.get() or "no config")

    if request.method == 'POST': 
        config = Config(request.form).change()
        response = jsonify({'registered config': config})

        keys = request.form.keys()

        if notifier:
            if 'name' in keys: 
                notifier.name = request.form['name']
            
            if 'notification' in keys:
                notifier.notification = request.form['notification']

        if 'time' in keys: 
            ntimer.time = request.form['time']
            ntimer.start()
        
    return response



@app.route('/token', methods=['GET', 'POST'])
def token():
    if request.method == 'GET':
        response = jsonify(Token.get() or "no token")

    if request.method == 'POST':
        token = request.form['token']
        Token(token).change()
        response = jsonify('registered token')

        if notifier: 
            notifier.token = token

    return response



@app.route('/notify')
def notify():
    response = jsonify("no notification")

    config = Config.get()
    name, nth, weekday = config['name'], config['nth'], config['weekday']
    
    amount = Amount.latest()
    
    if notifier and amount and amount[0]['amount'] >= AMOUNT_THRESHOLD:
            
        if todayIsCollectionDay(nth, weekday):
            if notifier.today():
                response = jsonify("notify for today")
        
        if tomorrowIsCollectionDay(nth, weekday):
            if notifier.tomorrow():
                response = jsonify("notify for tomorrow")
    
    return response



@app.route('/notify/test')
def test_notify():
    response = jsonify('no notification')
    
    if notifier:
        msg = request.args.get('msg') or "これはテスト通知です．"

        if notifier.notify(msg):
            response = jsonify({
                'msg': msg, 
                'API_KEY': FCM_API_KEY, 
                'token': Token.get()
            })
    
    return response

@app.before_first_request
def initializing():
    print('initializing')

    if os.environ.get('RESET_DB_BY_INIT') == '1':
        print('reset DB')
        db.drop_all()
    
    db.create_all()

    config = Config.get()
    
    if config:
        if notifier: 
            notifier.notification = config['notification']
            notifier.token = Token.get()    
            notifier.name = config['name']
            
        ntimer.time = config['time']
        ntimer.start()

if __name__ == '__main__':
    app.run()