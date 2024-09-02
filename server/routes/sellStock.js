const express = require('express');
const router = express.Router();

const { handleSellStock } = require('../controllers/sellStock');

router.post('/', handleSellStock);

module.exports = router;