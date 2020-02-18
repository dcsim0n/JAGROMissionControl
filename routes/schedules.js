
const express = require('express');
const assert = require('assert');
const router = express.Router();
const models = require('../models');

models.schedule.initialize();

router.get('/', function(req, res){

  models.schedule.findAll({ attributes: [ 'id', 'scheduleStr', 'topic', 'message', 'active']})
  .then((rows) => {
    console.log(req.query);
    if (req.query['reload']=='true'){
      models.schedule.reload();
    }
    return res.json(rows);
  })
})

router.post('/', function(req, res){
  try{
    assert(req.body.scheduleStr,"Missing sechdule string argument")
    assert(req.body.topic,"Missing topic string argument")
    assert(req.body.message,"Missing message string argument")
  
    models.schedule.create({
      scheduleStr: req.body.scheduleStr,
      topic: req.body.topic,
      message: req.body.message,
      active: req.body.active 
    })
    .then(( sched ) => {
      models.schedule.addSchedule(sched);
      res.status(200).json("OK");
    })
    .catch( err => {
      console.log("\n\n")
      console.error(err);
      res.status(422).json(err);
    })
  }catch(err){
    res.status(500).json(err);
  }
})

module.exports = router;