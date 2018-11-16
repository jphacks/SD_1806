#!/bin/sh
curl -X POST -d "amount=0" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=1" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=2" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=3" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=4" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=0" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=3" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=0" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=0" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=1" https://sugoigomibako.herokuapp.com/amount
curl -X POST -d "amount=4" https://sugoigomibako.herokuapp.com/amount

curl -X POST -d "smell=100" https://sugoigomibako.herokuapp.com/smell
curl -X POST -d "smell=200" https://sugoigomibako.herokuapp.com/smell
curl -X POST -d "smell=300" https://sugoigomibako.herokuapp.com/smell
curl -X POST -d "smell=500" https://sugoigomibako.herokuapp.com/smell
curl -X POST -d "smell=150" https://sugoigomibako.herokuapp.com/smell
curl -X POST -d "smell=800" https://sugoigomibako.herokuapp.com/smell

curl -X POST -d "name=プラごみ&nth=13&weekday=56" https://sugoigomibako.herokuapp.com/config
curl -X POST -d "token=abcdefg" https://sugoigomibako.herokuapp.com/token
