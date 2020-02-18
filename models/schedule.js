'use strict';

const SCHEDULES= {}
const nodeschedule = require('node-schedule');
const mqtt = require('../lib/mqtt');
const assert = require('assert');

const MESSAGE_OPTIONS = { qos: 1 };

function scheduleOne( sched ){
  assert(sched.id != undefined, "Missing ID for new schedule");
  
  const job = nodeschedule.scheduleJob(`Schedule: ${sched.id}`,sched.scheduleStr, function( ){
        console.log("Publishing message:", sched.topic, sched.message);
        mqtt.client.publish(sched.topic, sched.message, MESSAGE_OPTIONS);
      });
  
  assert(job,"Failed creating new job!");
  console.log("Loaded: ", job.name);
  SCHEDULES[sched.id] = job;
}

function scheduleAll( scheds ){
  // cancel all current jobs and re-build SCHEDULES from new

  assert(scheds.length != undefined, "Missing length property for schedules argument");
  const schedKeys = Object.keys(SCHEDULES);
  console.log("Active schedules: ",schedKeys);
  // cancel all jobs and throw away the keys
  schedKeys.forEach( key => {
    console.log("canceling schedule", key);
    SCHEDULES[key].cancel();
    delete SCHEDULES[key];
  })

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