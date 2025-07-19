const express = require('express');
const router = express.Router();
const { getChatbaseHash } = require('../controllers/chatbase');
const { authMiddleware } = require("../middleware/authmiddleware");

// Make sure to use authentication middleware if needed
router.get('/hash', authMiddleware, getChatbaseHash);

module.exports = router;