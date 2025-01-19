const UserUnlockArtist = require('../models/UserUnlockArtist.model');
const User = require('../models/User.model');
const Artist = require('../models/Artist.model');
const Service = require('../models/Service.model');
const ArtistTransaction = require('../models/ArtistTransaction.model');
const UserTransactionHistory = require('../models/UserTransactionHistory.model')

const unlockArtist = async (req, res) => {
  try {
    const { userId, artistId, serviceId } = req.body;

    // Validate User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate Artist
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Validate Service
    const service = await Service.findById(serviceId);
    if (!service || String(service.artistId) !== String(artistId)) {
      return res.status(404).json({ message: 'Invalid service for the given artist' });
    }

    // Check if artist is already unlocked
    const existingUnlock = await UserUnlockArtist.findOne({ userId, artistId });
    if (existingUnlock) {
      return res.status(400).json({ message: 'Artist already unlocked by this user' });
    }

    // Calculate the deduction amount (0.5% of the service price)
    const deductionAmount = service.price * 0.005;

    // Check artist's balance
    if (artist.balance < deductionAmount) {
      return res.status(400).json({ message: 'Insufficient balance in artist account' });
    }

    // Deduct the amount from the artist's balance
    artist.balance -= deductionAmount;
    await artist.save();

    user.SyncCoin -= 1;
    await user.save();

    // Create a new unlock entry
    const newUnlock = new UserUnlockArtist({ userId, artistId });
    const savedUnlock = await newUnlock.save();

    // Add the transaction to ArtistTransaction
    const transaction = new ArtistTransaction({
      artistId,
      amount: deductionAmount,
      type: 'debit',
      description: `Unlock by user ${userId} for service ${serviceId}`,
      unlockId: savedUnlock._id,
    });
    const savedArtistTransaction = await transaction.save();

    const userTransaction = new UserTransactionHistory({
      userId,
      amount: 0, // No monetary amount for user
      syncCoin: -1, // Deduct 1 SyncCoin
      transactionType: 'debit',
      description: `Unlock artist ${artistId} for service ${serviceId}`,
      unlockId: savedUnlock._id,
    });
    const savedUserTransaction = await userTransaction.save();


    // Respond with success
    res.status(201).json({
      message: 'Artist unlocked successfully',
      unlock: savedUnlock,
      artistTransaction: savedArtistTransaction,
      userTransaction: savedUserTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const isArtistUnlocked = async (req, res) => {
  try {
    const { userId, artistId } = req.params;

    const unlock = await UserUnlockArtist.findOne({ userId, artistId });
    if (!unlock) {
      return res.status(404).json({ message: 'Artist is not unlocked by this user' });
    }

    res.status(200).json({ message: 'Artist is unlocked by the user', unlock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnlockedArtists = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const unlockedArtists = await UserUnlockArtist.find({ userId })
      .populate('artistId', 'name email profilePic');

    res.status(200).json(unlockedArtists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  unlockArtist,
  isArtistUnlocked,
  getUnlockedArtists,
};
