# Models
## Interval
Allows users to create scheduled events

`Interval Properties`:
+ output / relay #
+ frequency
+ duration
+ start
+ stop

## Node
Nodes are physicla NodeMCU processors that are connected to sensors and relays

`Node Properites`
+ Unique ID
+ Relays
+ Sensors

## Relay Status
`Relay Status Properties`
+ Node Unique ID
+ Relay Num
+ Status

## Measurement
+ Node Unique ID
+ Sensor #
+ Value
+ Date & Time

# User Stories
+ Users can view current output from sensors in near realtime
+ Users can view historical output from sensors
+ Users can configure a schedule to control devices like lighting, water pumps, and air flow / heating
