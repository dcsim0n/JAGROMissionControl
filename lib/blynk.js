/*
* Blynk connectivity library
* Dana Simmons 2020
*
*/

const Blynk = require('blynk-library');
const models = require('../models');

exports.start = function (){
  const blynk = new Blynk.Blynk(process.env.BLYNK_TOKEN, { connector: new Blynk.TcpClient() })
  const v1 = new blynk.VirtualPin(1);
  const v2 = new blynk.VirtualPin(2);
  const v3 = new blynk.VirtualPin(3);
  const v4 = new blynk.VirtualPin(4);

  v1.on('read', function( ){

    models.measurement.findOne({where: {nodemcuId:4,sensorNum:1}, order: [['id','DESC']]})  
    .then( m => {
      v1.write(m.value)
    })
  });
  
  v2.on('read', function( ){
    models.measurement.findOne({where:{nodemcuId:4,sensorNum:2}, order: [['id','DESC']]})  
    .then( m => {
      v2.write(m.value)
    })
  });
 
  v3.on('read', function( ){
    models.measurement.findOne({where:{nodemcuId:4,sensorNum:3}, order: [['id','DESC']]})  
    .then( m => {
      v3.write(m.value)
    })
  }); 
  v4.on('read', function( ){
    models.measurement.findOne({where:{nodemcuId:4,sensorNum:4}, order: [['id','DESC']]})  
    .then( m => {
      v4.write(m.value)
    })
  }); 
  blynk.on('connect', ( ) => console.log("Blynk connected.."));
  blynk.on('disconnect', ( ) => console.log("Blynk disconnected..."));
  
  return { v1,v2,blynk};
}


