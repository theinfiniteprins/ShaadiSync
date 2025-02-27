const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/Payment.controller');
const { authMiddleware } = require("../middleware/authmiddleware");

// Webhook route must be first (no auth middleware)
router.post('/webhook', express.raw({ type: "application/json" }), paymentController.handleWebhook);

// Protected routes
router.post('/create-checkout-session', authMiddleware, paymentController.createCheckoutSession);
router.post('/withdraw', authMiddleware, paymentController.createWithdrawal);

module.exports = router;