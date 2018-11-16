from datetime import datetime, timedelta

WEEKDAYS = [
    '月曜',
    '火曜',
    '水曜',
    '木曜',
    '金曜',
    '土曜',
    '日曜'
]

def today():
    return datetime.utcnow() + timedelta(hours=9)

def tomorrow():
    return today() + timedelta(days=1)

def datetime_to_nth_weekday(dt):
    nth = int( (dt.day - 1) / 7 ) + 1
    weekday = dt.weekday()
    return nth, weekday

def isCollectionDay(nth, weekday, target_day):
    tg_nth, tg_weekday = datetime_to_nth_weekday(target_day)
    is_nth = not nth or str(tg_nth) in nth
    is_weekday = not weekday or str(tg_weekday) in weekday
    return is_nth and is_weekday

def todayIsCollectionDay(nth, weekday):
    return isCollectionDay(nth, weekday, today())

def tomorrowIsCollectionDay(nth, weekday):
    return isCollectionDay(nth, weekday, tomorrow())
