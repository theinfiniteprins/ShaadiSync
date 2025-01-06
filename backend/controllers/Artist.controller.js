const Artist = require('../models/Artist.model'); // Replace with the actual path to your Artist model
const ArtistType = require('../models/ArtistType.model'); // Replace with the actual path to your ArtistType model


// 1. Create a new Artist
const createArtist = async (req, res) => {
  try {
    const { email, password, name, mobileNumber, artistType, address, profilePic, description, certificates } = req.body;

    // Check if the email or mobile number already exists
    const existingArtist = await Artist.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingArtist) {
      return res.status(400).json({ message: 'Email or mobile number already exists' });
    }

    // Validate ArtistType
    const validArtistType = await ArtistType.findById(artistType);
    if (!validArtistType) {
      return res.status(400).json({ message: 'Invalid Artist Type' });
    }


    const newArtist = new Artist({
      email,
      password,
      name,
      mobileNumber,
      artistType,
      address,
      profilePic,
      description,
      certificates,
    });

    const savedArtist = await newArtist.save();

    // Exclude the password in the response
    const { password: pass, ...artistData } = savedArtist._doc;
    res.status(201).json(artistData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all Artists
const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find()
      .populate('artistType', 'type') // Populate artistType with its name
      .select('-password'); // Exclude password field
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get an Artist by ID
const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate('artistType', 'type') // Populate artistType with its name
      .select('-password'); // Exclude password field

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update an Artist (password cannot be updated)
const updateArtist = async (req, res) => {
  try {
    const { email, password, ...updates } = req.body;

    // Prevent email and password updates
    if (email || password) {
      return res.status(400).json({ message: 'Email and password updates are not allowed' });
    }

    // Validate ArtistType if provided
    if (updates.artistType) {
      const validArtistType = await ArtistType.findById(updates.artistType);
      if (!validArtistType) {
        return res.status(400).json({ message: 'Invalid Artist Type' });
      }
    }

    const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('artistType', 'type') // Populate artistType with its name
      .select('-password'); // Exclude password field

    if (!updatedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json(updatedArtist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete an Artist
const deleteArtist = async (req, res) => {
  try {
    const deletedArtist = await Artist.findByIdAndDelete(req.params.id);
    if (!deletedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json({ message: 'Artist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Block an Artist
const blockArtist = async (req, res) => {
  try {
    const blockedArtist = await Artist.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true }).select('-password');
    if (!blockedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json({ message: 'Artist blocked successfully', blockedArtist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Unblock an Artist
const unblockArtist = async (req, res) => {
  try {
    const unblockedArtist = await Artist.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true }).select('-password');
    if (!unblockedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.status(200).json({ message: 'Artist unblocked successfully', unblockedArtist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewBalance = async (req, res) => {
    try {
      const artist = await Artist.findById(req.params.id).select('balance');
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
      res.status(200).json({ balance: artist.balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updateIsVerified = async (req, res) => {
    try {
      const { isVerified } = req.body;
  
      if (typeof isVerified !== 'boolean') {
        return res.status(400).json({ message: 'isVerified must be a boolean value' });
      }
  
      const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, { isVerified }, { new: true }).select('-password');
      if (!updatedArtist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
      res.status(200).json({ message: 'isVerified status updated successfully', updatedArtist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  blockArtist,
  unblockArtist,
  viewBalance,
  updateIsVerified,
};
