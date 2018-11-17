from pyfcm import FCMNotification
from datetime import datetime
import time, requests, schedule, threading


class FCMNotifier():
    TITLE_TODAY = "今日はゴミの日"
    TITLE_TOMORROW = "明日はゴミの日"
    TITLE_SMELL = "ゴミ箱が臭いです"
    MESSAGE_TODAY = "のゴミ箱がいっぱいです．今日はゴミの日なので捨てに行きましょう！"
    MESSAGE_TOMORROW = "のゴミ箱がいっぱいです．明日はゴミの日なので捨てに行きましょう！"
    MESSAGE_SMELL = "のゴミ箱のにおいが強烈になっています．ゴミ箱をきれいにしましょう！"

    def __init__(self, api_key, gomibako_name="普通ゴミ", token=None, notification='1'):
        self.ps = FCMNotification(api_key)
        self.name = gomibako_name
        self.token = None
        self.notification = '1'

    def notify(self, title, msg):
        if self.token == None or self.notification in ['', '0']: 
            return False
        
        self.ps.notify_single_device(
            registration_id=self.token, 
            message_body=msg, 
            message_title=title, 
            sound="Default"
        )
        print("notify")
        return True

    def today(self):
        return self.notify(self.TITLE_TODAY, self.name+self.MESSAGE_TODAY)

    def tomorrow(self):
        return self.notify(self.TITLE_TOMORROW, self.name+self.MESSAGE_TOMORROW)

    def smell(self):
        return self.notify(self.TITLE_SMELL, self.name+self.MESSAGE_SMELL)



class NotificationTimer():
    def __init__(self, url):
        self.url = url
        self.time = ""
        self.active = True
        self.thread = None
    
    def notify_everyday(self):
        print(requests.get(self.url + 'notify').json())

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
