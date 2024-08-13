const express = require("express");
const router = express.Router();
const { handleIncome, handleExpenses } = require("../controllers/addData"); 

router.get("/", (req, res) => {
    return res.send("Data API is running...");
});
router.post("/incomes", handleIncome);
router.post("/expenses", handleExpenses);

module.exports = router;