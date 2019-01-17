const express = require('express');
const axios = require('axios');

const router = express.Router();

const webhookController = require('../controllers/webhook');
const messageController = require('../controllers/message');

router.get('/', webhookController.facebook_validation);

router.post('/', messageController.post_all_messages);

axios({
  url: process.env.FACEBOOK_MESSENGER_PROFILE,
  params: { access_token: process.env.FACEBOOK_ACCESS_TOKEN },
  method: 'POST',
  data: {
    get_started: {
      payload: 'GET_STARTED_PAYLOAD'
    }
  }
}).then(res => console.log(res.data)).catch(err => console.log(err));

axios({
  url: process.env.FACEBOOK_MESSENGER_PROFILE,
  params: { access_token: process.env.FACEBOOK_ACCESS_TOKEN },
  method: 'POST',
  data: {
    greeting: [
      {
        locale: 'default',
        text: 'Welcome to the Weather Bot, I am here to help with all your questions.'
      }
    ]
  }
}).then(res => console.log(res.data)).catch(err => console.log(err));

module.exports = router;
