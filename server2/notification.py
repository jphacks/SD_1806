from pyfcm import FCMNotification
from datetime import datetime
import time, requests, schedule, threading

class FCMNotifier():
    TITLE = "すごいゴミ箱"
    MESSAGE_TODAY = "のゴミ箱がいっぱいです．今日はゴミの日なので捨てに行きましょう！"
    MESSAGE_TOMORROW = "のゴミ箱がいっぱいです．明日はゴミの日なので捨てに行きましょう！"
    MESSAGE_SMELL = "のゴミ箱のにおいが強烈になっています．ゴミ箱をきれいにしましょう！"

    def __init__(self, api_key, gomibako_name="普通ゴミ"):
        self.ps = FCMNotification(api_key)
        self.name = gomibako_name
    
    def set_name(self, gomibako_name):
        self.name = gomibako_name

    def set_token(self, token):
        self.token = token

    def notify(self, msg):
        if not self.token: return
        return self.ps.notify_single_device(registration_id=self.token, message_title=self.TITLE, message_body=self.name+msg, sound="Default")

    def today(self):
        return self.notify(self.MESSAGE_TODAY)

    def tomorrow(self):
        return self.notify(self.MESSAGE_TOMORROW)

    def smell(self):
        return self.notify(self.MESSAGE_SMELL)

class NotificationTimer():
    def __init__(self, url):
        self.url = url
        self.thread = None
        self.active = True
    
    def set_time(self, time):
        self.time = time
        return self
    
    def set_base_url(self, url):
        self.url = url
        return url

    def notify_everyday(self):
        print(datetime.now(), requests.get(self.url + 'notify').json())

    def notify_thread(self):
        schedule.every().day.at(self.time).do(self.notify_everyday)
        while self.active:
            schedule.run_pending()
            time.sleep(1)
    
    def start(self):
        self.stop()
        self.thread = threading.Thread(target=self.notify_thread)
        self.thread.start()

    def stop(self):
        if self.thread:
            self.active = False
            self.thread.join()
            self.active = True
