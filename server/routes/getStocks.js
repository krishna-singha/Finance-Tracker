const express = require('express');
const router = express.Router();

const { handleGetStocks } = require('../controllers/getStocks');

router.post('/', handleGetStocks);

module.exports = router;