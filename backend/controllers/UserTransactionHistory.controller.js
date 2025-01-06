const UserTransactionHistory = require('../models/UserTransactionHistory.model');
const User = require('../models/User.model');

const createTransaction = async (req, res) => {
  try {
    const { userId, amount, syncCoin } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    if (syncCoin < 0) {
      return res.status(400).json({ message: 'SyncCoins cannot be negative' });
    }

    const newTransaction = new UserTransactionHistory({ userId, amount, syncCoin });
    const savedTransaction = await newTransaction.save();

    res.status(201).json({ message: 'Transaction created successfully', savedTransaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await UserTransactionHistory.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await UserTransactionHistory.findById(id).populate('userId', 'name email');
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
