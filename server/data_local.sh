#!/bin/sh
export FCM_API_KEY=AAAALX7eOX0:APA91bEo6y4e8UuH0fp_9SMkwTrKruwSKvTkle5wSW0vZn2i4Ws8HujeGQVU_IWZ8GV6jF1uAsxzQRhwIJ2-FF-JI-zKw2c4mq59bYo3BPZ1Y6UjsLOXlsQqpD0n4AukX8SV_Z4RnjlQ
export RESET_DB_BY_DEPLOY=0

curl -X POST -d "amount=0&datetime=2018-10-10 12:00:00" localhost:5000/amount
curl -X POST -d "amount=1&datetime=2018-10-11 12:00:00" localhost:5000/amount
curl -X POST -d "amount=2&datetime=2018-10-12 12:00:00" localhost:5000/amount
curl -X POST -d "amount=3&datetime=2018-10-13 12:00:00" localhost:5000/amount
curl -X POST -d "amount=4&datetime=2018-10-14 12:00:00" localhost:5000/amount
curl -X POST -d "amount=0&datetime=2018-10-15 12:00:00" localhost:5000/amount

curl -X POST -d "amount=3&datetime=2018-11-10 12:00:00" localhost:5000/amount
curl -X POST -d "amount=0&datetime=2018-11-11 12:00:00" localhost:5000/amount
curl -X POST -d "amount=0&datetime=2018-11-12 12:00:00" localhost:5000/amount
curl -X POST -d "amount=1&datetime=2018-11-13 12:00:00" localhost:5000/amount
curl -X POST -d "amount=4&datetime=2018-11-14 12:00:00" localhost:5000/amount

curl -X POST -d "smell=100" localhost:5000/smell
curl -X POST -d "smell=200" localhost:5000/smell
curl -X POST -d "smell=300" localhost:5000/smell
curl -X POST -d "smell=500" localhost:5000/smell
curl -X POST -d "smell=150" localhost:5000/smell
curl -X POST -d "smell=800" localhost:5000/smell

curl -X POST -d "name=プラごみ&nth=13&weekday=56&time=20:10" localhost:5000/config
curl -X POST -d "token=abcdefg" localhost:5000/token
