/**
 * MQTT Mock 
 * Dana Simmons 2020
 * 
 */
const MQTTMOCK = {
  client : {
    publish: jest.fn();
  }
}

module.exports = MQTTMOCK;