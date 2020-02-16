/*
*
* JAGRO Job Scheduler
* Dana Simmons 2020
*/

const schedule = require('node-schedule');
const models = require('../models'); 

// Load all schedules from DB into memory
models.schedule.findAll();