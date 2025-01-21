const UserTransactionHistory = require('../models/UserTransactionHistory.model');
const User = require('../models/User.model');
const UserUnlockArtist = require('../models/UserUnlockService.model');

const createTransaction = async (req, res) => {
  try {
    const { userId, amount, syncCoin, transactionType, description, unlockId } = req.body;

    // Validate User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate Amount and SyncCoins
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }
    if (syncCoin < 0) {
      return res.status(400).json({ message: 'SyncCoins cannot be negative' });
    }

    // Validate Transaction Type
    if (!['credit', 'debit'].includes(transactionType)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Validate UnlockId if Provided
    if (unlockId) {
      const unlock = await UserUnlockArtist.findById(unlockId);
      if (!unlock) {
        return res.status(404).json({ message: 'Invalid unlockId' });
      }
    }

    // Create Transaction
    const newTransaction = new UserTransactionHistory({
      userId,
      amount,
      syncCoin,
      transactionType,
      description,
      unlockId: unlockId || null, // Add unlockId only if provided
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', savedTransaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve Transactions
    const transactions = await UserTransactionHistory.find({ userId })
      .populate('unlockId') // Populate UnlockId details
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve Transaction by ID
    const transaction = await UserTransactionHistory.findById(id)
      .populate('userId', 'name email') // Populate User Details
      .populate('unlockId'); // Populate UnlockId Details

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete Transaction
    const transaction = await UserTransactionHistory.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactionHistory,
  getTransactionById,
  deleteTransaction,
};
