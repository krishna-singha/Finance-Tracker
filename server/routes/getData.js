const express = require('express');
const router = express.Router();

const { getIncomeData, getExpenseData } = require('../controllers/getData');

router.post("/income", getIncomeData);
router.post("/expense", getExpenseData);

module.exports = router;