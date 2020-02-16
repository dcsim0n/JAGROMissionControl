const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', function(req, res){
  models.relaystatus.findAll()
  .then( rows => {
    res.json(rows);
  })
})

module.exports = router