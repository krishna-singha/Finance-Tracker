const express = require("express");
const router = express.Router();
const handleAllTransections = require("../controllers/allTransections");

router.post("/", handleAllTransections);

module.exports = router;