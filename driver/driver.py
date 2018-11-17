import wiringpi as wp
import time
import atexit
import datetime
import subprocess
import requests
import threading
import spidev
import RPi.GPIO as GPIO
import pygame.mixer
import sys
import os

pd_pins = [19, 26, 21, 6, 5]
human_pin = 20
loop_interval = 0.3
notify_interval = 30
api_url = 'https://sugoigomibako.herokuapp.com/'
notify_sound = './gomi_today.wav'
post_amount_interval = 1.1

threshold = 500
smell_val = 0

pygame.mixer.init()
pygame.mixer.music.load("/home/pi/data/kussa.wav")

GPIO.setmode(GPIO.BCM)
GPIO.setup(17,GPIO.OUT)
GPIO.setup(22,GPIO.OUT)

spi = spidev.SpiDev()
spi.open(0,0)
spi.max_speed_hz=1000000
spi.bits_per_word=8

dummy = 0xff
start = 0x47
sgl = 0x20
ch0 = 0x00
msbf = 0x08

class SmellThread(threading.Thread):
    
    def __init__(self):
        super(SmellThread, self).__init__()
        self.stop_event = threading.Event()
        self.setDaemon(True)
    
    def stop(self):
        self.stop_event.set()
        
    def smell_measure(self, ch):
        ad = spi.xfer2( [ (start + sgl + ch + msbf), dummy ] )
        val = ((ad[0] & 0x03) << 8) + ad[1]
        return val

    def run(self):
        try:
            while not self.stop_event.is_set():
                time.sleep(0.237)

                GPIO.output(22,True)
                time.sleep(0.003)

                ch0_val = SmellThread.smell_measure(self,ch0)
                Val = 1023 - ch0_val
                time.sleep(0.002)
                GPIO.output(22,False)
                
                GPIO.output(17,True)
                time.sleep(0.008)
                GPIO.output(17,False)

                global smell_val
                smell_val =  Val

        except KeyboardInterrupt:
            pass

        pygame.mixer.music.stop()
        spi.close()

def cleanup():
    print('cleanup completed')


def setup():
    wp.wiringPiSetupSys()
    for pd_pin in pd_pins:
        wp.pinMode(pd_pin,  wp.GPIO.INPUT)
    atexit.register(cleanup)
    print('setup completed')


def get_amount():
    pd_stats = [wp.digitalRead(pd_pin) for pd_pin in pd_pins]
    num_filled = len([0 for pd_stat in pd_stats if not pd_stat])
    return num_filled


def is_human_detected():
    return wp.digitalRead(human_pin)


def notify():
    subprocess.call('aplay {}'.format(notify_sound), shell=True)

def post_amount(amount):
    print('\033[32;1m==== posting amount: ' + str(amount) + ' ====\033[0m')
    try:
        responce = requests.post(api_url + 'amount', {'amount': amount})
        if responce.status_code != 200:
            print('\033[31;1m==== failed to post amount: ' + responce.status_code + ' ====\033[0m')
    except:
       pass
    
def post_smell_val(smell_val):
    print('\033[32;1m==== posting smell_val: ' + str(smell_val) + ' ====\033[0m')
    try:
        response = requests.post(api_url + 'smell', {'smell': smell_val})
        if response.status_code != 200:
            print('\033[31;1m==== failed to post smell_vall: ' + response.status_code + ' ====\033[0m')
    except:
       pass 


def main():
    setup()
    smell_thread = SmellThread();

    green = '\033[32;1m'
    red = '\033[31;1m'
    clear = '\033[0m'

    last_notified = time.time() - notify_interval
    last_posted_amount = 0
    last_amount_changed = time.time() - notify_interval
    previous_amount = 0
    previous_smell_val = 0
    
    smell_thread.start()
    
    while True:
        now = time.time()

        # current status
        pd_stats = [wp.digitalRead(pd_pin) for pd_pin in pd_pins]
        os.system('clear')
        print(datetime.datetime.now())
        for i, (pd_pin, pd_stat) in enumerate(zip(pd_pins, pd_stats), 1):
            print('  [{}] {} {}{}{} (GPIO #{})'.format(
                i,
                pd_stat,
                green if pd_stat else red,
                'EMPTY' if pd_stat else 'FILLED',
                clear,
                pd_pin
            ))
        amount = get_amount()
        print('  amount: {}{} ({}%){}'.format(
            red if amount > 0.5 else green,
            amount,
            amount / len(pd_pins) * 100,
            clear
        ))

        # notification triggered by human sensor
        print('  human sensor: {}'.format(is_human_detected()))
        if is_human_detected() and amount >= len(pd_pins) - 1:
            if now - last_notified > notify_interval:
                print('play notification...')
                notify()
                last_notified = now
            # TODO: consider day of week
        
        # smell sensor
        print('  smell sensor: {}'.format(smell_val))
        
        # amount smell control
        if previous_amount != amount:
            last_amount_changed = time.time()
        keep_time = now - last_amount_changed
        print('amount keep time: ' + str(keep_time))
        if keep_time > post_amount_interval:
            if last_posted_amount != amount:
                post_amount_thread = threading.Thread(target=post_amount, args=([amount]))
                post_amount_thread.start()
                last_posted_amount = amount
        previous_amount = amount
        
        if abs(smell_val - previous_smell_val) > 100:
            post_smell_thread = threading.Thread(target=post_smell_val, args=([smell_val]))
            post_smell_thread.start()
            previous_smell_val = smell_val
        
        time.sleep(loop_interval)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
