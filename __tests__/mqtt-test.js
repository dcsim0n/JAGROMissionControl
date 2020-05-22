/**
 * JAGRO MQTT Unit tests
 * Dana Simmons 2020
 */

const mqttMock = require('mqtt');

const mqtt = require('../lib/mqtt'); 
const models = require('../models');


describe('JAGRO MQTT can parse mqtt messages', ( )=>{
  test('mqtt has a "createJagroMessage" method', ()=>{
    expect(typeof(mqtt.createJagroMessage)).toBe('function');
  })

  test('createJagroMessage returns a JAGRO message', ( )=>{
    const newMessage = mqtt.createJagroMessage("jagro/JAGRO4/sensor/4/temp", 'so long and thanks for all the fish');
    expect(newMessage.domain).toBe('jagro');
    expect(newMessage.node).toBe('JAGRO4');
    expect(newMessage.ioType).toBe('sensor');
    expect(newMessage.ioPin).toBe('4');
    expect(newMessage.modifier).toBe('temp');
    expect(newMessage.content).toBe('so long and thanks for all the fish');
  })

  test('createJagroMessage won\'t accept bad data', ( )=>{
    expect( ()=>mqtt.createJagroMessage([1,2],null)).toThrow();
    expect( ()=>mqtt.createJagroMessage("","")).toThrow();
  })
})

describe('JAGRO subscribes when connected', ( )=>{
    test('JAGRO subscribes 3 times once connected', ( )=>{
      mqtt.start();
      mqtt.client.emit('connect');
      expect(mqtt.client.subscribe).toHaveBeenCalledTimes(3);
    })
})

describe('JAGRO reacts to incoming message', () => {
  // test that messages trigger the correct data in the database
  // relay status should get updated
  // sync message should be processed
  // sensor data should be written
  // unrecognized messages should be handled
})

