

const { Op } = require('sequelize');
const assert = require('assert');
const mqtt = require('../lib/mqtt');

const TRIGGERS = {};
const TRIGGER_CHECK_INTERVAL = 5000;
const MESSAGE_OPTIONS = { qos: process.env.SCHEDULE_QOS };


function buildTrigger( trigger ){
  TRIGGERS[ trigger.id ] = setInterval(()=>{
    // collect all measurements that are inside of the smoothing / averaging window
    trigger.getWindowedValues()
    // calculate the average
    .then( measurements => {
      assert(measurements.length > 0 , "Unable to calculate trigger without any measurements, maybe adjust value of smoothing window!")
      const sumValue = measurements.reduce( ( t, m ) => t += m.value, 0 ) // total all measurement values
      const avgValue = sumValue / measurements.length;
      // if the average meets the trigger value 
      // ( greater than or less than based on direction )
      console.log("Trigger: ", trigger.id, ", Active?: ", trigger.active, ", Trigger value: ", trigger.triggerValue, ", Current Value: ", avgValue, ", Window total: ", sumValue );
      if( (trigger.direction === 'rising') && (avgValue > trigger.triggerValue) && (!trigger.active) ){
        console.log("RISING trigger bounds exceeded! send a message");
        trigger.sendTriggerMessage();
        trigger.update({active: true })
      }
      if( (trigger.direction === 'rising') && (avgValue <= trigger.triggerValue) && (trigger.active) ){
        console.log("RISING trigger condition satisfied, deactivating");
        trigger.update({active: false })
      }
      if( (trigger.direction === 'falling') && (avgValue < trigger.triggerValue) && (!trigger.active) ){
        console.log("FALLING trigger bounds exceeded! send a message");
        trigger.sendTriggerMessage();
        trigger.update({active: true });
      }
      if( (trigger.direction === 'falling') && (avgValue >= trigger.triggerValue) && (trigger.active) ){
        console.log("FALLING trigger condition satisfied! deactivating");
        trigger.update({active: false });
      }
    })
    .catch( error => {
      console.log( error );
    });
  }, TRIGGER_CHECK_INTERVAL)
}

module.exports = (sequelize, DataTypes) => {
  const trigger = sequelize.define('trigger', {
    sensorNum: { type: DataTypes.INTEGER, allowNull: false },
    nodemcuId: { type: DataTypes.INTEGER, allowNull: false },
    triggerValue: DataTypes.FLOAT,
    smoothingWindow: DataTypes.INTEGER,
    direction: DataTypes.STRING,
    correction: DataTypes.FLOAT,
    topic: DataTypes.STRING,
    message: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    description: DataTypes.STRING
  }, {});
 
  trigger.associate = function ( models ){
    trigger.belongsTo(models.nodemcu);
  }
  
  trigger.prototype.getWindowedValues = function(){
    // Build date objects that cover the smoothing window
    const startWindowTime = new Date();
    const endWindowTime = new Date(); // Object.assign( startWindowTime, {}); // Make copy of start time
    endWindowTime.setMinutes( startWindowTime.getMinutes() - this.smoothingWindow ) // Calculate the date object for x minutes ago
    
    // Find all measurements with nodemcuID and sensorNum
    return this.getNodemcu()
    .then( mcu => {
      if(this.smoothingWindow === 0){
        // If window = 0, just return the last measurement
        return mcu.getMeasurements({ 
          limit: 1, 
          where: { sensorNum: this.sensorNum }, 
          order: [['time', 'DESC']]}
        );
      }else{
        return mcu.getMeasurements({
          where: { [Op.and]: [
            { sensorNum: this.sensorNum },
            { time: {[Op.between]: [endWindowTime, startWindowTime]}}
          ]},
          order: [['time', 'DESC']]
        })
      }
    }) 
    .then( measurements => {
      console.log("Fetched number of measurements: ", measurements.length );
      return measurements; //return measurements wrapped in a Promise
    })

  }
  
  trigger.prototype.sendTriggerMessage = function sendTriggerMessage(){
    mqtt.client.publish( this.topic, this.message, MESSAGE_OPTIONS );
  }
 
  trigger.initialize = function(){
    return trigger.findAll({ include: 'nodemcu' })
    .then( triggers => {
      // initialize each trigger into application memory
      triggers.forEach( trigger =>{
        buildTrigger( trigger );
      })
      console.log("Initialized triggers: ", Object.keys(TRIGGERS).length );
    })
  }

  trigger.reload = function(){
    // cancel every trigger and reload
    Object.keys(TRIGGERS).forEach( key => {
      console.log("Clearing trigger: ", key);
      clearInterval(TRIGGERS[key]);
    });
    // load triggers from database again
    trigger.initialize();
  }

  trigger.addTrigger = buildTrigger;

  trigger.deleteTrigger = function( id ){
    clearInterval(TRIGGERS[id]);
    delete TRIGGERS[id];
    return trigger.findByPk( id )
    .then( row =>{
      return row.destroy();
    })
  }
  return trigger;
}