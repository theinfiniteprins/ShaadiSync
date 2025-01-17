const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,

  deleteTransaction,
  getTransactionsByArtist,
} = require('../controllers/ArtistTransaction.controller');

const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.post('/', authMiddleware, createTransaction); // Create new transaction
router.get('/artist/:artistId', authMiddleware, getTransactionsByArtist); // Get transactions by artist
router.get('/:id', authMiddleware, getTransactionById); // Get transaction by ID

router.get('/', authMiddleware, isAdminMiddleware, getAllTransactions); // Get all transactions

// router.delete('/:id', authMiddleware, deleteTransaction); // Delete transaction (No one should be able to delete transactions)

module.exports = router;
