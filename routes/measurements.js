const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', function(req, res){
  if(Object.keys(req.query).length > 0){
    //handle query params
  }else{
    models.measurement.findAll({ limit: 500, order: [['time', 'DESC']] })
    .then( rows => {
      return res.json(rows);
    })
  }
})

router.get('/:nodeid', function(req, res){
  if(Object.keys(req.query).length > 0){
    //handle query params
  }else{
    models.measurement.findAll({where: { nodemcuId: req.params.nodeid }, limit: 500, order: [['time', 'DESC']] })
    .then( rows => {
      return res.json(rows);
    })
  } 
})
router.get('/:nodeid/:sensorid', function(req, res){
  if(Object.keys(req.query).length > 0){
    //handle query params
  }else{
    models.measurement.findAll({where: { nodemcuId: req.params.nodeid, sensorNum: req.params.sensorid }, limit: 500, order: [['time', 'DESC']] })
    .then( rows => {
      return res.json(rows);
    })
  } 
})
module.exports = router