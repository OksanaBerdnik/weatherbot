const express = require('express');

const router = express.Router();

const weatherService = require('../service/weather');

router.post('/', weatherService);

module.exports = router;
