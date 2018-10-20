import json, os

INITIAL_CONFIG = {
    'name': '',
    'category': '',
    'collection': '',
    'notify_for_today': '',
    'notify_for_tomorrow': '',
    'notification_time_for_today': '',
    'notification_time_for_tomorrow': ''
}

def set_config(config, form):
    result = INITIAL_CONFIG.copy()
    for key in result: 
        result[key]='keep'
    for item in result:
        if item in form: 
            result[item] = 'changed'
            config[item] = form[item]
    return config, result

def init_config(config_file): 
    if not os.path.exists(config_file):
        with open(config_file, 'w') as config:
            json.dump(INITIAL_CONFIG, config)