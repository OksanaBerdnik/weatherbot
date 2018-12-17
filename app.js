require('dotenv/config');

const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./db/db_connection');

const webhookRoutes = require('./routes/webhook');
const weatherRoutes = require('./routes/weather');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.sync().then(() => {
  app.listen(process.env.PORT || process.env.LOCALHOST_PORT);

  app.use('/webhook', webhookRoutes);
  app.use('/weather', weatherRoutes);
});
