const express = require('express');
const router = express.Router();
const models = require('../models');

models.trigger.initialize();

router.get('/', function( req, res ){
  models.trigger.findAll()
  .then( triggers =>{
    res.json(triggers);
  }) 
})

router.post('/', function( req, res ){
  const { triggerValue, topic, message, sensorNum, nodemcuId, smoothingWindow, direction } = req.body;
  models.trigger.create({
    triggerValue,
    topic,
    message,
    sensorNum,
    nodemcuId,
    smoothingWindow
  })
  .then( () =>{
    res.json("OK");
  })
})

module.export = router