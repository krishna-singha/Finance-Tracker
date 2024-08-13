const express = require('express');
const router = express.Router();

const { getIncomeData, getExpenseData } = require('../controllers/getData');

router.post("/incomes", getIncomeData);
router.post("/expenses", getExpenseData);

module.exports = router;