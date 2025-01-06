const UserUnlockArtist = require('../models/UserUnlockArtist.model');
const User = require('../models/User.model');
const Artist = require('../models/Artist.model');

const unlockArtist = async (req, res) => {
  try {
    const { userId, artistId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const existingUnlock = await UserUnlockArtist.findOne({ userId, artistId });
    if (existingUnlock) {
      return res.status(400).json({ message: 'Artist already unlocked by this user' });
    }

    const newUnlock = new UserUnlockArtist({ userId, artistId });
    const savedUnlock = await newUnlock.save();

    res.status(201).json({ message: 'Artist unlocked successfully', savedUnlock });
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
