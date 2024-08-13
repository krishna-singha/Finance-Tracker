const express = require('express');
const router = express.Router();

const { handleUser } = require('../controllers/user');

router.post('/', handleUser);

module.exports = router;