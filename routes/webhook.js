const express = require('express');

const router = express.Router();

const webhookController = require('../controllers/webhook');
const messageController = require('../controllers/message');

router.get('/', webhookController.facebook_validation);

router.post('/', messageController.post_all_messages);

module.exports = router;
