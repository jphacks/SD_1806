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



def today():
    return datetime.utcnow() + timedelta(hours=9)



def tomorrow():
    return today() + timedelta(days=1)



def datetime_to_nth_weekday(dt):
    nth = int( (dt.day - 1) / 7 ) + 1
    weekday = dt.weekday()

    return nth, weekday



def collection_day_to_nth_weekday(cd):
    nth = ""
    weekday = ""

    if len(cd) == 2:
        weekday = str(WEEKDAYS.index(cd))

    elif re.search('[0-9]', cd):
        nth = ''.join(re.findall('[0-9]', cd))
        weekday = str(WEEKDAYS.index(re.sub('[0-9]|・', '', cd)))

    else:
        weekday = ''.join([str(WEEKDAYS.index(day)) for day in cd.split('・')])

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
