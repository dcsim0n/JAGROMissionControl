/*
* Blynk connectivity library
* Dana Simmons 2020
*
*/

const Blynk = require('blynk-library');
const models = require('../models');
const mqtt = require('./mqtt');

exports.start = function (){
  const blynk = new Blynk.Blynk(process.env.BLYNK_TOKEN, { connector: new Blynk.TcpClient() })
  // One virtual pin per sensor input
  const v1 = new blynk.VirtualPin(1);
  const v2 = new blynk.VirtualPin(2);
  const v3 = new blynk.VirtualPin(3);
  const v4 = new blynk.VirtualPin(4);
  // One virtual pin per button / relay status
  const b1 = new blynk.VirtualPin(5);
  const b2 = new blynk.VirtualPin(6);
  const l1 = new blynk.VirtualPin(7);
  const l2 = new blynk.VirtualPin(8);


  v1.on('read', function( done ){
    // Get the temperature 
    models.measurement.findOne({where: {nodemcuId:4,sensorNum:1}, order: [['id','DESC']]})  
    .then( m => {
      v1.write(m.value)
      done && done();
    })
  });
  
  v2.on('read', function( ){
    // Get the humidity
    models.measurement.findOne({where:{nodemcuId:4,sensorNum:2}, order: [['id','DESC']]})  
    .then( m => {
      v2.write(m.value)
    })
  });
 
  v3.on('read', function( ){
    // Get the soil temperature
    models.measurement.findOne({where:{nodemcuId:4,sensorNum:3}, order: [['id','DESC']]})  
    .then( m => {
      v3.write(m.value)
    })
  }); 
  v4.on('read', function( ){
    // Get the soil moisture
    models.measurement.findOne({where:{nodemcuId:4,sensorNum:4}, order: [['id','DESC']]})  
    .then( m => {
      v4.write(m.value)
    })
  }); 

  b1.on('write', function(data){
   // When blynk button pressed, send relay change message 
    console.log("Sending relay command: 1, ", data);
    mqtt.client.publish('jagro/JAGRO1/relay/1', data);
  });

  b2.on('write', function(data){
   // When blynk button pressed, send relay change message 
    console.log("Sending relay command: 1, ", data);
    mqtt.client.publish('jagro/JAGRO1/relay/2', data);
  });

  blynk.on('connect', ( ) => {

    console.log("Blynk connected..");

    mqtt.client.on('message', function(topic, message){
      
      const incoming = mqtt.createJagroMessage(topic,message);
      if(incoming.ioType === 'relay'){
        if(incoming.ioPin === '1'){
          l1.write(parseInt(incoming.content));
        }
        if(incoming.ioPin === '2'){
          l2.write(parseInt(incoming.content));
        }
      }
    });
  });
  blynk.on('disconnect', ( ) => console.log("Blynk disconnected..."));
  blynk.on('error', ( error ) => {
    console.log("Blynk encountered a problem: ", error );
    console.log("Trying to reconnect...");
    blynk.disconnect(true); // will reconnect by default
  }) 
  // Return object of internals
  return { v1, v2, v3, v4, b1, b2, l1, l2, blynk};
  
}


