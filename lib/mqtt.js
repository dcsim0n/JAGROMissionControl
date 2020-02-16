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
    for(let i = 0; i < topicParts.length; i++ ){
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

    client.subscribe('jargo/+/sensor/+', function(err){
      if(err){
        console.log(err);
      }else{
        console.log('Subscribed...');
      }
    })
  })
  
  client.on('message', function (topic, message) {

    const incomming = new JagroMessage(topic, message);

    switch (incoming.ioType) {
      case 'relay':
        //Handle realy input 
        break;
      case 'sensor':
        //Handle sensor input
        break;

      default:
        break;
    }
    // do something based on the topic
    // models. handle
    console.log(data);
  })

}
