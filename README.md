# JAGRO Mission Control
+ Just
+ Another
+ Garden
+ RObot

`Mission Control` is a JSON api that serves as a management interface for controlling operations of a greenhouse or home garden. Mission control receives sensor data and hardware status information through a MQTT message broker. 

Users can configure scheduled events and data based triggers that are used to automate common gardening tasks: watering, temperature control, etc..

For information on the Nodes (IoT microcontrollers) that send data to Mission Control visit the JAGRO repository
+ [Jagro](https://github.com/dcsim0n/JAGRO)


# Models

## Schedule
Allows users to create scheduled events using crontab syntax

`Schedule`:
+ scheduleStr
+ topic
+ message
+ active

## Node
Nodes are physical NodeMCU processors that are connected to sensors and relays

`Node Properites`
+ uniqueId
+ numOfRelays
+ numOfSensors

## Relay Status
State of each node's relays, only updated when
a mqtt message is received from a node with matching unique id string. Logic is inverted, so 1 = off / contacts open, and 0 = on / contacts closed

If there is no node or relay status that matches and incoming message, a new row will be created in nodemcus and relaystatuses table

`Relay Status Properties`
+ nodemcuId
+ Relay Num
+ Status

## Measurement
Log of sensor measurements, one row for each incoming message with a topic that matches jagro/{unique id}/sensor/{sensor #}

If there is not a row in nodemcus with matching uniqueId, a new row is created

time is set by mission control upon receipt of the message, not by the sending node

`Measurement Properties`
+ Node Unique ID
+ Sensor #
+ Value
+ Time

## Trigger
Allows users to define conditions that use sensor data as input and will send mqtt messages as output. Can be used to control devices such as water pumps or fans in response to sensor data ( soil moisture or air temperature )

Smoothing window allows users to define a windowed average as the trigger value instead of one sample. By setting smoothing window > 0, measurements from x minutes into the past will be averaged together and evaluated as the trigger input.

`Trigger Properties`

+ sensorNum  
+ trend direction: ( rising, falling )
+ correction amount
+ trigger value
+ smoothing window

# User Stories
+ Users can view current output from sensors in near realtime
+ Users can view historical output from sensors
+ Users can configure a schedule to control devices like lighting, water pumps, and air flow / heating
+ Users can define triggers that will become active when certain sensor conditions are met.
+ Triggers will execute pre-defined events when activated