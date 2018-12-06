const express = require('express');
const app = express();
require('dotenv/config');

const bodyParser = require('body-parser');

const webhookRoutes = require('./routes/webhook');
const weatherRoutes = require('./routes/weather');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 5000);

app.use('/webhook', webhookRoutes);
app.use('/weather', weatherRoutes);
