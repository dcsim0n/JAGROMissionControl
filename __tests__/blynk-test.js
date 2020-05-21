/*
* Blynk Unit Test
* Dana Simmons 2020
*
*/

const blynk = require('../lib/blynk');
const mqtt = require('mqtt');
const mqttMock = require('../lib/mqtt');
const models = require('../models');

describe('Blynk has a client', ()=> {
  test('Blynk has a start method', ()=> {
    expect(blynk.start).toBeDefined()
  });
});

describe('Blynk.start returns internal objects', ()=>{
  test('Start returns an object', ()=>{
    const guts = blynk.start();
    expect(guts).toHaveProperty('blynk');
  })
})

describe('Virtual pins return data when read', ()=>{
  const {v1, v2} = blynk.start();
  beforeAll(( )=>{
    return models.measurement.create({
      nodemcuId:4,
      sensorNum:1,
      value:42
    })
  })

  afterAll(( )=>{
    return models.measurement.destroy({truncate: true});
  })
  test('v1.write() gets called',( done )=>{

    const callbackTest = ( )=>{
      expect(v1.write).toHaveBeenCalled();
      done();
    }
    v1.emit('read', callbackTest );
  })

  test('v1.write() sends correct data', ( )=>{
    
    const callbackTest = ( )=>{
      expect(v1.write).toHaveBeenCalledWith(42);
      done();
    }
    v1.emit('read', callbackTest );
  })

})

describe('button pins respond to \'write\' event', ( ) => {
  
  const {b1, b2} = blynk.start();

  test('Buttons publish a message for state changes', ( )=>{
    b1.emit('write',1);
    expect(mqttMock.client.publish).toHaveBeenCalled();
  })

  test('Buttons trigger the correct relay message and data', ( ) =>{
    b1.emit('write', 1);
    expect(mqttMock.client.publish.mock.calls[1][0]).toBe("jagro/JAGRO1/relay/1");
    expect(mqttMock.client.publish.mock.calls[1][1]).toBe(1);
  })
})
