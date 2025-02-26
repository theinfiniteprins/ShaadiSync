const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/Payment.controller');
const {authMiddleware} = require("../middleware/authmiddleware");

router.post('/create-checkout-session', authMiddleware, paymentController.createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.handleWebhook);

module.exports = router;