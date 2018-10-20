from collection_searcher import search_by_id
from datetime import datetime, timedelta
import re

WEEKDAYS = [
    '月曜',
    '火曜',
    '水曜',
    '木曜',
    '金曜',
    '土曜',
    '日曜'
]

def now():
    return datetime.utcnow() + timedelta(hours=9)

def tomorrow():
    return now() + timedelta(days=1)

def datetime_to_nth_weekday(dt):
    nth = int( (dt.day - 1) / 7 ) + 1
    weekday = dt.weekday()
    return nth, weekday

def collection_day_to_nth_weekday(cd):
    dict = {'nth': [], 'weekday': []}
    try:
        if len(cd) == 2:
            dict['weekday'] = [WEEKDAYS.index(cd)]
            return dict
        elif re.search('[0-9]', cd):
            dict['nth'] = [int(day) for day in re.findall('[0-9]', cd)]
            dict['weekday'] = [WEEKDAYS.index(re.sub('[0-9]|・', '', cd))]
        else:
            dict['weekday'] = [WEEKDAYS.index(day) for day in cd.split('・')]
    except: 
        pass
    return dict

def isCollectionDay(collection, config, dt):
    if not config['category'] or not config['collection']: return None
    collection = search_by_id(collection, config['collection'])
    nth_weekday = collection_day_to_nth_weekday(collection[config['category']])
    today_nth, today_weekday = datetime_to_nth_weekday(dt)
    is_nth = not nth_weekday['nth'] or today_nth in nth_weekday['nth']
    is_weekday = not nth_weekday['weekday'] or today_weekday in nth_weekday['weekday']
    return is_nth and is_weekday

def nowIsCollectionDay(collection, config):
    return isCollectionDay(collection, config, now())

def tomorrowIsCollectionDay(collection, config):
    return isCollectionDay(collection, config, tomorrow())