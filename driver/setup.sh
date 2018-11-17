# photo diode

gpio -g mode 19 down
gpio -g mode 26 down
gpio -g mode 21 down
gpio -g mode 6 down
gpio -g mode 5 down

gpio export 19 in
gpio export 26 in
gpio export 21 in
gpio export 6 in
gpio export 5 in

# human sensor

gpio -g mode 20 down
gpio export 20 in

# smellsensor
gpio export 17 out
gpio export 22 out
