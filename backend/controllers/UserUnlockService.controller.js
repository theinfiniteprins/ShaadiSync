const UserUnlockService = require('../models/UserUnlockService.model');
const User = require('../models/User.model');
const Artist = require('../models/Artist.model');
const Service = require('../models/Service.model');
const ArtistTransaction = require('../models/ArtistTransaction.model');
const UserTransactionHistory = require('../models/UserTransactionHistory.model')

const unlockService = async (req, res) => {
  try {
    const { userId, serviceId } = req.body;

    // Validate User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate Service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if artist is already unlocked
    const existingUnlock = await UserUnlockService.findOne({ userId, serviceId });
    if (existingUnlock) {
      return res.status(400).json({ message: 'Service already unlocked by this user' });
    }

    // Calculate the deduction amount (0.5% of the service price)
    const deductionAmount = service.price * 0.005;

    const artist = await Artist.findById(service.artistId);
    if (!artist) {
      return res.status(400).json({ message: 'Artist not found for this service' });
    }

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
    const newUnlock = new UserUnlockService({ userId, serviceId });
    const savedUnlock = await newUnlock.save();

    const artistId = service.artistId;

    // Add the transaction to ArtistTransaction
    const transaction = new ArtistTransaction({
      artistId,
      amount: deductionAmount,
      type: 'debit',
      description: `Unlock by user ${user.email} for service ${service.name}`,
      unlockId: savedUnlock._id,
    });
    const savedArtistTransaction = await transaction.save();

    const userTransaction = new UserTransactionHistory({
      userId,
      amount: 0, // No monetary amount for user
      syncCoin: -1, // Deduct 1 SyncCoin
      transactionType: 'debit',
      description: `Unlock artist ${artist.email} for service ${service.name}`,
      unlockId: savedUnlock._id,
    });
    const savedUserTransaction = await userTransaction.save();

    // Check user's balance against 0.5% of maxCharge
    const maxChargeThreshold = artist.maxCharge * 0.005;
    if (artist.balance < maxChargeThreshold) {
      // Toggle off all live services that don't meet the balance criteria
      const liveServices = await Service.find({ artist: artistId, isLive: true });

      for (const liveService of liveServices) {
        const serviceThreshold = liveService.price * 0.005;
        if (artist.balance < serviceThreshold) {
          await toggleServiceLiveStatus({ params: { id: liveService._id } }, res);
        }
      }
    }


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



const isServiceUnlocked = async (req, res) => {
  try {
    const { userId, serviceId } = req.params;

    const unlock = await UserUnlockService.findOne({ userId, serviceId });
    if (!unlock) {
      return res.status(404).json({ message: 'Service is not unlocked by this user' });
    }

    res.status(200).json({ message: 'Service is unlocked by the user', unlock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnlockedServices = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const unlockedServices = await UserUnlockService.find({ userId })
      .populate('artistId', 'name email profilePic');

    res.status(200).json(unlockedServices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  unlockService,
  isServiceUnlocked,
  getUnlockedServices,
};


