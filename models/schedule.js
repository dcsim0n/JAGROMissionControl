'use strict';

const SCHEDULES= {}
const nodeschedule = require('node-schedule');
const mqtt = require('../lib/mqtt');

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
        SCHEDULES[row.id] = nodeschedule.scheduleJob(row.scheduleStr,( ) => {
          console.log("Publishing message:", row.topic, row.message);
          mqtt.client.publish(row.topic, row.message);
    });
  });

  schedule.deleteSchedule = function( id ){
    SCHEDULES[id].cancel();
    delete SCHEDULES[id]; //clear references
    schedule.findOne(id)
    .then( row => {
      row.destroy();
    });
  }
});
  }
  schedule.associate = function(models) {
    // associations can be defined here
  };
  return schedule;
};