/**
 * MQTT Mock 
 * Dana Simmons 2020
 * 
 */
const events = require('events');

class MockMQQTClient extends events.EventEmitter {
  constructor(){
    super();
    this.publish = jest.fn(console.log)
    this.subscribe = jest.fn(console.log)
  }
}
const MQTTMOCK = {
  connect: jest.fn(( )=>{
    return new MockMQQTClient( ) ;
  })
}

module.exports = MQTTMOCK;