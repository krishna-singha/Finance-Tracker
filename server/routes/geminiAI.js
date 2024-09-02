const express = require("express");
const router = express.Router();

const { handleGenerateText } = require("../controllers/geminiAI");

router.post("/", handleGenerateText);

module.exports = router;