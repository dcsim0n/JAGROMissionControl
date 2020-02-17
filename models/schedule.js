'use strict';

const SCHEDULES= {}
const nodeschedule = require('node-schedule');
const mqtt = require('../lib/mqtt');

const REFRESH_RATE = 3000;

// Load all schedules from DB into memory
module.exports = (sequelize, DataTypes) => {
  const schedule = sequelize.define('schedule', {
    scheduleStr: DataTypes.STRING,
    topic: DataTypes.STRING,
    message: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {});

  schedule.initialize = function( ){
    schedule.findAll()
    .then((items) => {
      items.forEach( row => {
        if(row.active){
          SCHEDULES[row.id] = nodeschedule.scheduleJob(row.scheduleStr,( ) => {
            console.log("Publishing message:", row.topic, row.message);
            mqtt.client.publish(row.topic, row.message);
          });
        }
        console.log("Schedules loaded: ", SCHEDULES);
      });
    });
  }

  schedule.addSchedule = function( sched ){
    SCHEDULES[sched.id] = nodeschedule.scheduleJob(sched.scheduleStr, ( ) => {
      console.log("Publishing message: ", sched.topic, sched.message);
      mqtt.client.publish(sched.topic, sched.message);
    });
  }
  // Rereshing schedules on a regular basis
  // Could cause schedules to be missed
  // Needs testing
  schedule.reload = function (){
    console.log("Reloading schedules");
    schedule.findAll()
    .then((items) => {
      items.forEach((row) => {
        // Refresh the schedule for each job
        if(SCHEDULES[row.id]){
          SCHEDULES[row.id].reschedule(row.scheduleStr);
        }else{
          SCHEDULES[row.id] = nodeschedule.scheduleJob(row.scheduleStr, ( ) => {
            console.log("Publishing message: ", row.topic, row.message);
            mqtt.client.publish(row.topic, row.message);
          });
        }
      });
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