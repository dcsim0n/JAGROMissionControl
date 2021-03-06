const express = require('express');
const router = express.Router();
const models = require('../models');

models.trigger.initialize();

router.get('/', function( req, res ){
  
  models.trigger.findAll()
  .then( triggers =>{
    if(req.query.reload == 'true'){
      models.trigger.reload();
    }
    res.json(triggers);
  }) 
  .catch( error =>{
    res.status(500).json({ "error": error })
  })
})

router.post('/', function( req, res ){
  const {
    triggerValue,
    topic,
    message,
    sensorNum,
    nodemcuId,
    smoothingWindow,
    direction, 
    description
  } = req.body;
  
  models.trigger.create({
    triggerValue,
    topic,
    message,
    sensorNum,
    nodemcuId,
    smoothingWindow,
    direction,
    active: false,
    description
  })
  .then( ( trigger ) =>{
    models.trigger.addTrigger(trigger);
    res.json("OK");
  })
  .catch( error =>{
    console.log(error);
    res.status(422).json("Unable to add new trigger");
  })
})

router.delete('/:triggerId', function( req, res ){
  models.trigger.deleteTrigger( req.params.triggerId ) 
  .then( ()=>{
    res.json("OK");
  })
  .catch( error =>{
    console.log(error);
    res.status(500).json(`Error removing trigger: ${ req.params.triggerId }`);
  })
})

module.exports = router