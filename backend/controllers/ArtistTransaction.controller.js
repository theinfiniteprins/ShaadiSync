const ArtistTransaction = require('../models/ArtistTransaction.model');
const Artist = require('../models/Artist.model');

const createTransaction = async (req, res) => {
  try {
    const { artistId, amount, type, description } = req.body;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    if (!['credit', 'debit'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    if (type === 'debit' && artist.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance for debit transaction' });
    }

    artist.balance = type === 'credit' ? artist.balance + amount : artist.balance - amount;
    await artist.save();

    const newTransaction = new ArtistTransaction({
      artistId,
      amount,
      type,
      description,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', savedTransaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await ArtistTransaction.find()
      .populate('artistId', 'name email')
      .exec();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionsByArtist = async (req, res) => {
  try {
    const artistId = req.params.artistId;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const transactions = await ArtistTransaction.find({ artistId }).exec();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await ArtistTransaction.findById(req.params.id)
      .populate('artistId', 'name email')
      .exec();

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
    const transaction = await ArtistTransaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const artist = await Artist.findById(transaction.artistId);
    if (transaction.type === 'credit') {
      artist.balance -= transaction.amount;
    } else {
      artist.balance += transaction.amount;
    }
    await artist.save();

    await transaction.remove();
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionsByArtist,
  getTransactionById,
  deleteTransaction,
};
