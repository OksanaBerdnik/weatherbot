require('dotenv/config');

const express = require('express');
const morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser');

const webhookRoutes = require('./routes/webhook');
const weatherRoutes = require('./routes/weather');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || process.env.LOCALHOST_PORT);

app.use('/webhook', webhookRoutes);
app.use('/weather', weatherRoutes);
