/**
 * JAGRO MQTT Unit tests
 * Dana Simmons 2020
 */

const mqttMock = require('mqtt');

const mqtt = require('../lib/mqtt'); 
const models = require('../models');

// do some setup for the database
beforeAll( ()=>{
  return models.nodemcu.create({
    uniqueId:'JAGRO1'
  })
  .then( nodemcu =>{
  
    return models.relaystatus.bulkCreate([
          {uniqueId:'JAGRO1', relayNum: 1, status: 0, nodemcuId: nodemcu.id},
          {uniqueId:'JAGRO1', relayNum: 2, status: 0, nodemcuId: nodemcu.id},
          {uniqueId:'JAGRO1', relayNum: 3, status: 0, nodemcuId: nodemcu.id},
          {uniqueId:'JAGRO1', relayNum: 4, status: 0, nodemcuId: nodemcu.id}
    ]);

  });

});

// clear out the test data
afterAll( async ()=>{
  await models.measurement.destroy({truncate:true})
  await models.nodemcu.destroy({truncate:true})
  await models.relaystatus.destroy({truncate:true})
})

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

  // relay status should get updated
  test("relay status should get updated", (done)=>{

    //create hook to fire after the database is updated
    models.relaystatus.afterUpdate( r =>{
      models.relaystatus.findOne({where: {uniqueId: 'JAGRO1', relayNum: 1}})
      .then( relay =>{
        expect(relay.status).toBe(1);
        done();
      });
    
    });
    
    //send relay status update
    mqtt.client.emit('message', 'jagro/JAGRO1/relay/1','1');

  });
  
  // sync message should be processed
  test("sync messages should be return a response", (done)=>{

    mqtt.client.emit('message', 'jagro/JAGRO1/sync','');
    // not pretty but since the getRelaystatuses() is async, need to wait
    // for it to return and publish to be called
    setTimeout(()=>{
        expect(mqtt.client.publish).toHaveBeenCalledTimes(4);
        done();
    }, 2000);

  });

  // sensor data should be written
  test("sensor data should be recorded", (done)=>{

    expect.assertions(1)

    // emit sensor message
    for(let i = 1; i < 6; i++){
      mqtt.client.emit('message', `jagro/JAGRO1/sensor/${i}`,String(i));
    }

    setTimeout(()=>{
      models.measurement.count()
      .then( c => {
        // make sure that the count of records is correct
        expect(c).toBe(5);
      })
      .finally( ()=> done());
     
    },2000)

  })

  test("unrecognized messages should not cause errors", (done)=>{
    //unknown messages should be accepted without error
    //unknown messages should have no side effects

    expect.assertions(6);

    mqtt.client.emit('message', 'test/123','no data');

    models.measurement.count()
    .then (c => {
      expect(c).toBe(5);
      return models.relaystatus.findAll();
    })
    .then( relays =>{
      expect(relays.length).toBe(4);
      expect(relays[0].status).toBe(1);
      expect(relays[1].status).toBe(0);
      expect(relays[2].status).toBe(0);
      expect(relays[3].status).toBe(0);
    })
    .finally(()=>done())
  })
})

