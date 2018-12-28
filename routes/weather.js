const express = require('express');

const router = express.Router();

const routerService = require('../controllers/router');

router.post('/', routerService);

module.exports = router;
