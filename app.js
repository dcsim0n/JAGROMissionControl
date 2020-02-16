const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config();

const mqtt = require('./lib/mqtt');
const users = require('./routes/users');
const schedules = require('./routes/schedules');

const app = express();

mqtt.start();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/users', users);
app.use('/api/v1/schedules', schedules);

module.exports = app;
