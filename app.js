const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config();

const mqtt = require('./lib/mqtt');
const blynk = require('./lib/blynk');
const users = require('./routes/users');
const schedules = require('./routes/schedules');
const relays = require('./routes/relays');
const measurements = require('./routes/measurements');

const app = express();

const blynkClient = blynk.start();
mqtt.start();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/users', users);
app.use('/api/v1/schedules', schedules);
app.use('/api/v1/relays', relays);
app.use('/api/v1/measurements',measurements);

module.exports = app;
