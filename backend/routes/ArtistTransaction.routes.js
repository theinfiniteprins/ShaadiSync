const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,

  deleteTransaction,
  getTransactionsByArtist,
} = require('../controllers/ArtistTransaction.controller');

router.post('/', createTransaction); // Create new transaction
router.get('/', getAllTransactions); // Get all transactions
router.get('/:id', getTransactionById); // Get transaction by ID
router.delete('/:id', deleteTransaction); // Delete transaction
router.get('/artist/:artistId', getTransactionsByArtist); // Get transactions by artist

module.exports = router;
