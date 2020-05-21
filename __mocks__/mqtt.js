/**
 * MQTT Mock 
 * Dana Simmons 2020
 * 
 */
const MQTTMOCK = {
  connect: jest.fn( ()=>{
    return { // the client object
      publish: jest.fn(console.log)
    }
  })
}

module.exports = MQTTMOCK;