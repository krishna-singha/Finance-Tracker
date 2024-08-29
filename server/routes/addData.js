const express = require("express");
const router = express.Router();
const { handleIncome, handleExpenses, handleStocks } = require("../controllers/addData"); 

router.get("/", (req, res) => {
    return res.send("Data API is running...");
});
router.post("/income", handleIncome);
router.post("/expense", handleExpenses);
router.post("/stock", handleStocks);

module.exports = router;