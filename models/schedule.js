'use strict';

const SCHEDULES= {}
const nodeschedule = require('node-schedule');
const mqtt = require('../lib/mqtt');
const assert = require('assert');

const MESSAGE_OPTIONS = { qos: 1 };

function scheduleOne( sched ){
  assert(sched.id, "Missing ID for new schedule");
  SCHEDULES[sched.id] = nodeschedule.scheduleJob(`Schedule: ${sched.id}`,sched.scheduleStr, function( ){
        console.log("Publishing message:", sched.topic, sched.message);
        mqtt.client.publish(sched.topic, sched.message, MESSAGE_OPTIONS);
  });
}

function scheduleAll( scheds ){
  // cancel all current jobs and re-build SCHEDULES from new

  assert(scheds.length != undefined, "Missing length property for schedules argument");

  schedKeys = Object.keys(SCHEDULES);
  // cancel all jobs and throw away the keys
  if(schedKeys.length > 0 ){
    for(let i = 0; i < schedKeys.length; i ++){
      SCHEDULES[i].cancel()
      delete SCHEDULES[i];
    }
  }

  //Initialize each job
  scheds.forEach( sched => {
    if(sched.active){
      scheduleOne( sched );      
    }
  });

  console.log(`Canceled ${schedKeys.length} Jobs. Loaded ${scheds.length} Jobs`)
}
module.exports = (sequelize, DataTypes) => {
  const schedule = sequelize.define('schedule', {
    scheduleStr: DataTypes.STRING,
    topic: DataTypes.STRING,
    message: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});

  schedule.initialize = function( ){
    schedule.findAll()
    .then(( scheds ) => {
      scheduleAll( scheds );
    });
  }

  schedule.addSchedule = scheduleOne;
  
  schedule.reload = function (){
    console.log("Reloading schedules...");
    schedule.findAll()
    .then(( scheds ) => {
      scheduleAll( scheds );
    });
  }

  schedule.deleteSchedule = function( id ){
    SCHEDULES[id].cancel();
    delete SCHEDULES[id]; //clear references
    schedule.findOne(id)
    .then( row => {
      row.destroy();
    });
  }

  schedule.associate = function(models) {
    // associations can be defined here
  };
  return schedule;
}