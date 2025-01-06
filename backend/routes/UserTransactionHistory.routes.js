const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getTransactionHistory,
    getTransactionById,
    deleteTransaction,
} = require('../controllers/UserTransactionHistory.controller');

router.post('/', createTransaction); // Create user transaction
router.get('/', getTransactionHistory); // Get all user transactions
router.get('/:id', getTransactionById); // Get user transaction by ID
router.delete('/:id', deleteTransaction); // Delete user transaction

module.exports = router;
