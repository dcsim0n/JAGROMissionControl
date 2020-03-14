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

module.export = router