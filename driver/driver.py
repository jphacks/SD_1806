import wiringpi as wp
import time
import atexit
import time
import datetime
import subprocess
import requests

pd_pins = [19, 26, 21, 6, 5]
human_pin = 20
loop_interval = 0.5
notify_interval = 60
api_url = 'https://jonghelper.com/gomi/'
notify_sound = './gomi_today.wav'
post_amount_interval = 1.6


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
    responce = requests.post(api_url + 'amount', {'amount': amount})
    if responce.status_code != 200:
        print('\033[31;1m==== failed to post amount: ' + responce.status_code + ' ====\033[0m')


def main():
    setup()

    green = '\033[32;1m'
    red = '\033[31;1m'
    clear = '\033[0m'

    last_notified = time.time() - notify_interval
    last_posted_amount = 0
    last_amount_changed = time.time() - notify_interval
    previous_amount = 0

    while True:
        now = time.time()

        # current status
        pd_stats = [wp.digitalRead(pd_pin) for pd_pin in pd_pins]
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

        # amount control
        if previous_amount != amount:
            last_amount_changed = time.time()
        keep_time = now - last_amount_changed
        print('amount keep time: ' + str(keep_time))
        if keep_time > post_amount_interval:
            if last_posted_amount != amount:
                post_amount(amount)
                last_posted_amount = amount
        previous_amount = amount

        time.sleep(loop_interval)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
