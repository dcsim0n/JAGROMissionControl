
const express = require('express');
const assert = require('assert');
const router = express.Router();
const models = require('../models');

models.schedule.initialize();

router.get('/', function(req, req){
  models.schedule.findAll()
  .then( rows => {
    req.json(rows);
  })
})

router.post('/', function(req, res){
  try {
    assert(req.body.scheduleStr,"Missing sechdule string argument")
    assert(req.body.topic,"Missing topic string argument")
    assert(req.body.message,"Missing message string argument")
  } catch (error) {
    res.status = 422;
    res.json({error: "Unable to create schedule"});
  }
})

module.exports = router;