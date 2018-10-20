import json, os

INITIAL_CONFIG = {
    'id': ''
}

def set_fcm_config(config, form):
    if 'id' in form:
        json.dump({"id": form['id']}, config)
    return config

def init_fcm_config(config_file): 
    if not os.path.exists(config_file):
        with open(config_file, 'w') as config:
            json.dump(INITIAL_CONFIG, config)