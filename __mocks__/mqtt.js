/**
 * MQTT Mock 
 * Dana Simmons 2020
 * 
 */
const assert = require('assert');
const events = require('events');

class MockMQQTClient extends events.EventEmitter {
  constructor(){
    super();
    this.publish = jest.fn(( data )=>{
      assert(typeof(data) === 'string'); 
      console.log(data)
    });
    this.subscribe = jest.fn(console.log)
  }
}
const MQTTMOCK = {
  connect: jest.fn(( )=>{
    return new MockMQQTClient( ) ;
  })
}

module.exports = MQTTMOCK;