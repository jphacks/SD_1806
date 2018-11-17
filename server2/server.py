from flask import Flask, request, jsonify
from entities import Entities
from notification import FCMNotifier, NotificationTimer
from collection_day_checker import todayIsCollectionDay, tomorrowIsCollectionDay
import os

DEBUG = True

AMOUNT_THRESHOLD = 3
SMELL_THRESHOLD = 500

BASE_URL = os.environ.get('BASE_URL')
RESET_DB_BY_INIT = os.environ.get('RESET_DB_BY_INIT')
FCM_API_KEY = os.environ.get('FCM_API_KEY')
DATABASE_URL = os.environ.get('DATABASE_URL')
DB_FILE = 'gomibako.db'

notifier = FCMNotifier(FCM_API_KEY) if FCM_API_KEY else None
ntimer = NotificationTimer(BASE_URL)

app = Flask(__name__)
app.debug = DEBUG

db_url = DATABASE_URL or "sqlite:///" + os.path.join(app.root_path, DB_FILE)
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['JSON_AS_ASCII'] = False

ett = Entities(app)
Amount = ett.Amount()
Smell = ett.Smell()
Config = ett.Config()
Token = ett.Token()
Collection = ett.Collection()



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



def update(form):
    keys = form.keys()

    if notifier:
        if 'name' in keys: 
            notifier.name = form['name']
        
        if 'notification' in keys:
            notifier.notification = form['notification']

    if 'time' in keys: 
        ntimer.time = request.form['time']
        ntimer.start()


@app.route('/config', methods=['GET', 'POST'])
def config(): 
    if request.method == 'GET':
        response = jsonify(Config.get() or "no config")

    if request.method == 'POST': 
        config = Config(request.form).change()
        response = jsonify({'registered config': config})

        update(request.form)
        
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



@app.route('/collection')
def collection():
    id = request.args.get('id')
    sorting_id = request.args.get('sorting_id')

    if not id or not sorting_id:
        response = jsonify('idとsorting_idを指定してください．')
        response.status_code = 400
        return response

    nth, weekday = Collection.nth_weekday(id, sorting_id)
    result = {'nth': nth, 'weekday': weekday}

    return jsonify(result)



@app.route('/collection/search')
def collection_search():
    pref_id = request.args.get('pref_id') or 0
    city_id = request.args.get('city_id') or 0
    ku_id = request.args.get('ku_id')
    kana1 = request.args.get('kana1')
    kana2 = request.args.get('kana2')
    result = Collection.search(pref_id, city_id, ku_id, kana1, kana2)

    return jsonify(result)



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
                'api_key': FCM_API_KEY, 
                'token': Token.get()
            })
    
    return response



@app.before_first_request
def initializing():
    print('initializing')

    if RESET_DB_BY_INIT == '1':
        print('reset DB')
        ett.db.drop_all()
        ett.db.create_all()
        Collection.create()

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