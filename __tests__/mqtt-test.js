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

  // test that messages trigger the correct data in the database
describe('JAGRO reacts to incoming message', () => {
  afterEach(()=>{
    models.relaystatus.removeHook('afterUpdate','afterFind');
    // return models.relaystatus.destroy({truncate:true});
  });
  // relay status should get updated
  test("relay status should get updated", (done)=>{

    // clear out all statuses from previous tests
    models.relaystatus.destroy({truncate: true})
    .then( ()=>{
      //send relay status update
      mqtt.client.emit('message', 'jagro/JAGRO1/relay/1','1');
      //create hook to fire after the database is updated
      models.relaystatus.afterUpdate( r =>{
        models.relaystatus.findOne({where: {uniqueId: 'JAGRO1'}})
        .then( relay =>{
          expect(relay.status).toBe(1);
          done();
        });

      });
      
    });

  });
  
  // sync message should be processed
  test("sync messages should be return a response", (done)=>{

    //add some relays
    models.relaystatus.bulkCreate([
      {uniqueId:'JAGRO1', relayNum: 2, status: 0, nodemcuId:1},
      {uniqueId:'JAGRO1', relayNum: 3, status: 0, nodemcuId:1},
      {uniqueId:'JAGRO1', relayNum: 4, status: 0, nodemcuId:1}
    ])
    .then(()=>{
      mqtt.client.emit('message', 'jagro/JAGRO1/sync','');
      // not pretty but since the getRelaystatuses() is async, need to wait
      // for it to return and publish to be called
      setTimeout(()=>{
          expect(mqtt.client.publish).toHaveBeenCalledTimes(4);
          done();
      }, 3000);

    });

  });

  // sensor data should be written

  test("sensor data should be recorded", ()=>{
    // emit sensor message
    // make sure that the count of records is correct
  })

  test("unrecognized messages should not cause errors", ()=>{

  })
})

