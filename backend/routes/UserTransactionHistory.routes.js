const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getTransactionHistory,
    getTransactionById,
    deleteTransaction,
} = require('../controllers/UserTransactionHistory.controller');

const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.post('/', authMiddleware, createTransaction); // Create user transaction
router.get('/getHistory', authMiddleware, getTransactionHistory); // Get all user transactions
router.get('/:id',authMiddleware,  getTransactionById); // Get user transaction by ID

//router.delete('/:id', deleteTransaction); // Delete user transaction (No one should be able to delete transactions)

module.exports = router;
