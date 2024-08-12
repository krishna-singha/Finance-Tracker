const express = require("express");
const router = express.Router();
const { handleApi, handleGetStocksData } = require("../controllers/api");

router.get("/", handleApi);
router.get("/stocks", handleGetStocksData);

module.exports = router;