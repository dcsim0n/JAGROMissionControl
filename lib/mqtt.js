/*
* MQTT Setup
* Dana Simmons 2020
*/

const mqtt = require('mqtt');
const models = require('../models/index');

// Subscribe to /jagro/+/sensor/+

// Subscribe to /jagro/+/relay/+/status

// Define what to do when receiving a message

var client  = mqtt.connect(process.env.MQTT_ADDRESS, { username: process.env.MQTT_USER, password: process.env.MQTT_PASS });
const assert = require('assert');

class JagroMessage {
  constructor (topic, message){
    assert(typeof(topic === 'string'), "Unable to parse non-string topic");
    assert(typeof(message.toString) === 'function', 'message argument must contain toString method');
    
    this.domain = null;
    this.node = null;
    this.ioType = null;
    this.ioPin = null;
    this.modifier = null;
    this.content = message.toString();
    const topicParts = topic.split('/');
    const objKeys = Object.keys(this); // make an ordered array with our class properties

    // traverse the length of topicParts and insert each part as properites
    // only interate to the length of the shortest set of keys
    // Should follow the following pattern
    // Topic: domain / node / ioType / ioPin / modifier
    for(let i = 0; (i < topicParts.length) && (i < objKeys.length); i++ ){
     this[objKeys[i]] = topicParts[i];
    }
  }
}

function assembleCommand(topic, message){
 
}
exports.client = client;

exports.start = function(){

  client.on('connect', function () {
    // Subscribe to status updates
    client.subscribe('jagro/+/relay/+/status', function (err) {
      if(err){
        console.log(err);
      }else{
        console.log('Subscribed...');
      }
    })

    client.subscribe('jagro/+/sensor/+', function(err){
      if(err){
        console.log(err);
      }else{
        console.log('Subscribed...');
      }
    })

    client.subscribe('jagro/+/sync', function(err){
      if(err){
        console.log(err);
      }else{
        console.log('Subscribed...');
      }
    })
  })
  
  client.on('message', function (topic, message) {

    const incoming = new JagroMessage(topic, message);
    
    switch (incoming.ioType) {
      case 'relay':
        console.log(`Received relay status: ${incoming.ioPin}, ${incoming.content}`)
        
        models.nodemcu.findOrCreate({where: {uniqueId: incoming.node }})
        .spread( mcu =>{
          !mcu.id && mcu.save();
          return models.relaystatus.findOrCreate({where: {nodemcuId: mcu.id, uniqueId: incoming.node, relayNum: incoming.ioPin}})
        })
        .spread( row =>{
          row.status = parseInt(incoming.content);
          row.save();
        })
        break;
      case 'sensor':
        //Handle sensor input
        console.log(`Received sensor status: ${incoming.ioPin}, ${incoming.content}`)
        models.nodemcu.findOrCreate({where: {uniqueId: incoming.node }})
        .spread( mcu =>{
          !mcu.id && mcu.save();
          models.measurement.create({
              nodemcuId: mcu.id,
              uniqueId: incoming.node,
              sensorNum: incoming.ioPin,
              time: new Date(),
              value: parseFloat(incoming.content)
            })
        })
        break;

      case 'sync':
        // Handle sync request
        console.log(`Received sync message from: ${incoming.node}`);
        models.nodemcu.findOrCreate({where: { uniqueId: incoming.node }})
        .spread( mcu => {
          return mcu.getRelaystatuses();
        })
        .then( statuses =>{
          statuses.forEach( status => {
            //Send a relay command with the status that was last saved in the DB
            //There may be additional items to synchronize in the future
            console.log("Syncing Relay: ", status.uniqueId, status.relayNum, status.status.toString());
            client.publish(`jagro/${status.uniqueId}/relay/${status.relayNum}`, status.status.toString());
          })
        })
	break;

      default:
        console.log("Received un-recognized event type: ", incoming);
        break;
    }
    // do something based on the topic
    // models. handle
  });

}
