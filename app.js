const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const mqtt = require('./lib/mqtt');
const blynk = require('./lib/blynk');
const users = require('./routes/users');
const schedules = require('./routes/schedules');
const relays = require('./routes/relays');
const measurements = require('./routes/measurements');
const triggers = require('./routes/triggers');
const app = express();

//Only connect to Blynk if we have a valid token
process.env.BLYNK_TOKEN != "" && blynk.start();

mqtt.start();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/users', users);
app.use('/api/v1/schedules', schedules);
app.use('/api/v1/relays', relays);
app.use('/api/v1/measurements',measurements);
app.use('/api/v1/triggers',triggers);

module.exports = app;
