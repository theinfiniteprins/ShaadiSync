const mongoose = require('mongoose');
const UserUnlockService = require('../models/UserUnlockService.model');
const User = require('../models/User.model');
const Artist = require('../models/Artist.model');
const Service = require('../models/Service.model');
const ArtistTransaction = require('../models/ArtistTransaction.model');
const UserTransactionHistory = require('../models/UserTransactionHistory.model');
const { updateMaxCharge } = require('./Service.controller');

const unlockService = async (req, res) => {
  const session = await mongoose.startSession(); // Start the session
  session.startTransaction(); // Start the transaction

  try {
    const { serviceId } = req.body;
    const userId = req.id;

    // Validate User
    const user = await User.findById(userId).session(session);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate Service
    const service = await Service.findById(serviceId).session(session);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if artist is already unlocked
    const existingUnlock = await UserUnlockService.findOne({ userId, serviceId }).session(session);
    if (existingUnlock) {
      return res.status(400).json({ message: 'Service already unlocked by this user' });
    }

    // Check if user has enough SyncCoins
    if (user.SyncCoin < 1) {
      return res.status(400).json({ message: 'Insufficient SyncCoins' });
    }

    // Calculate the deduction amount (0.5% of the service price)
    const deductionAmount = service.price * 0.005;

    const artist = await Artist.findById(service.artistId).session(session);
    if (!artist) {
      return res.status(400).json({ message: 'Artist not found for this service' });
    }

    // Check artist's balance
    if (artist.balance < deductionAmount) {
      return res.status(400).json({ message: 'Insufficient balance in artist account' });
    }

    // Deduct the amount from the artist's balance
    artist.balance -= deductionAmount;
    await artist.save({ session });

    // Deduct 1 SyncCoin from the user
    user.SyncCoin -= 1;
    await user.save({ session });

    // Create a new unlock entry
    const newUnlock = new UserUnlockService({ userId, serviceId });
    const savedUnlock = await newUnlock.save({ session });

    const artistId = service.artistId;

    // Add the transaction to ArtistTransaction
    const transaction = new ArtistTransaction({
      artistId,
      amount: deductionAmount,
      type: 'debit',
      description: `Unlock by user ${user.email} for service ${service.name}`,
      unlockId: savedUnlock._id,
    });
    const savedArtistTransaction = await transaction.save({ session });

    // Add the transaction to UserTransactionHistory
    const userTransaction = new UserTransactionHistory({
      userId,
      amount: 0, // No monetary amount for user
      syncCoin: -1, // Deduct 1 SyncCoin
      transactionType: 'debit',
      description: `Unlock artist ${artist.email} for service ${service.name}`,
      unlockId: savedUnlock._id,
    });
    const savedUserTransaction = await userTransaction.save({ session });

    // Check user's balance against 0.5% of maxCharge
    const maxChargeThreshold = artist.maxCharge * 0.005;
    if (artist.balance < maxChargeThreshold) {
      // Toggle off all live services that don't meet the balance criteria
      const liveServices = await Service.find({ artistId: artist._id, isLive: true }).session(session);
      await updateLiveServices(liveServices, artist, session); // Using session here for live services
      await updateMaxCharge(artist._id, session); // Update maxCharge with session
    }

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    // Respond with success
    res.status(201).json({
      message: 'Artist unlocked successfully',
      unlock: savedUnlock,
      artistTransaction: savedArtistTransaction,
      userTransaction: savedUserTransaction,
    });
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

const updateLiveServices = async (liveServices, artist, session) => {
  const updatedServices = []; // To store the updated services

  for (const liveService of liveServices) {
    const serviceThreshold = liveService.price * 0.005;

    if (artist.balance < serviceThreshold) {
      liveService.isLive = false;
      const updatedService = await liveService.save({ session });
      updatedServices.push(updatedService); // Add to the updatedServices array
    }
  }

  return updatedServices; // Return the updated services
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
      .populate('serviceId', 'name price photos');

    res.status(200).json(unlockedServices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // First check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Find all unlock records for this service and populate user details
    const unlockedUsers = await UserUnlockService.find({ serviceId })
      .populate({
        path: 'userId',
        select: 'name email phone'
      })
      .populate({
        path: 'serviceId',
        select: 'name ' // Only select necessary fields
      })
      .sort({ createdAt: -1 });


    // Format the response
    const response = {
      service: {
        _id: service._id,
        name: service.name,
      },
      unlockedBy: unlockedUsers.map(unlock => ({
        _id: unlock._id,
        userId: unlock.userId,
        createdAt: unlock.createdAt
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getUserByService:', error);
    res.status(500).json({ 
      message: 'Failed to fetch service users',
      error: error.message 
    });
  }
};
const getLatestUnlockedLead = async (req, res) => {
  try {
    const artistId = req.id;

    // Find the latest unlocked service for the given artist
    const latestUnlock = await UserUnlockService.findOne()
      .sort({ createdAt: -1 }) // Get the latest unlock
      .populate({
        path: 'serviceId',
        select: 'name artistId', // Fetch service name and artistId
      })
      .populate({
        path: 'userId',
        select: 'name email',
      });

    // Check if unlock exists and belongs to the given artist
    if (!latestUnlock || !latestUnlock.serviceId || latestUnlock.serviceId.artistId.toString() !== artistId) {
      return res.status(404).json({ message: 'No unlocked leads found for this artist' });
    }

    res.status(200).json({
      serviceId: latestUnlock.serviceId._id, // ✅ Added serviceId
      service: latestUnlock.serviceId.name,
      user: latestUnlock.userId.name,
      userEmail: latestUnlock.userId.email,
      unlockedAt: latestUnlock.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMonthlyLeadsByArtist = async (req, res) => {
  try {
    const  artistId  = req.id;
    
    if (!artistId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid artist ID" });
    }

    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 4); // Get data from the last 5 months

    const leads = await UserUnlockService.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      { $match: { "service.artistId": new mongoose.Types.ObjectId(artistId), createdAt: { $gte: fiveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          totalLeads: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    // Format the data to ensure all last 5 months are included
    const result = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const leadData = leads.find((l) => l._id.year === year && l._id.month === month);
      result.push({ year, month, totalLeads: leadData ? leadData.totalLeads : 0 });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnlockStatsByArtist = async (req, res) => {
  try {
    const artistId = req.id;
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const timeFilters = [
      { label: "today", date: startOfDay },
      { label: "lastWeek", date: startOfWeek },
      { label: "lastMonth", date: startOfMonth },
      { label: "lastYear", date: startOfYear },
    ];

    const results = {};

    for (const filter of timeFilters) {
      const count = await UserUnlockService.aggregate([
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: "$service" },
        { $match: { "service.artistId": new mongoose.Types.ObjectId(artistId), createdAt: { $gte: filter.date } } },
        { $count: "total" },
      ]);

      results[filter.label] = count.length > 0 ? count[0].total : 0;
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  unlockService,
  isServiceUnlocked,
  getUnlockedServices,
  getUserByService,
  getLatestUnlockedLead,
  getMonthlyLeadsByArtist,
  getUnlockStatsByArtist,
};
