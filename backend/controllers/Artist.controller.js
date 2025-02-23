const Artist = require('../models/Artist.model'); // Replace with the actual path to your Artist model
const ArtistType = require('../models/ArtistType.model'); // Replace with the actual path to your ArtistType model
const zod = require("zod");


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
      verificationStatus: undefined, // Initially not set
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
      .populate('artistType', 'type')
      .select('-password +isBlocked'); // Add +isBlocked to include it
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
      const artist = await Artist.findById(req.id).select('balance');
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
      const isVerified = true;
      const verificationStatus = "confirmed"; // Mark as confirmed

      const updatedArtist = await Artist.findByIdAndUpdate(
        req.params.id, 
        { isVerified, verificationStatus }, 
        { new: true }
      ).select('-password');

      if (!updatedArtist) {
        return res.status(404).json({ message: 'Artist not found' });
      }

      res.status(200).json({ message: 'Artist verified successfully', updatedArtist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


  const verificationbody = zod.object({
    aadharCardNumber: zod.string().regex(/^\d{12}$/, 'Aadhar card number must be a 12-digit number'),
    accountNumber: zod.string().regex(/^\d{9,18}$/, 'Account number must be between 9 and 18 digits'),
    confirmAccountNumber: zod.string().regex(/^\d{9,18}$/, 'Confirmation account number must be between 9 and 18 digits'),
    ifscCode: zod.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC code must be valid'),
    bankDocument: zod.string().url('Bank document must be a valid URL'),
    aadharCardFile: zod.string().url('Aadhar card file must be a valid URL'),
  }).refine(data => data.accountNumber === data.confirmAccountNumber, {
    message: 'Account number and confirmation account number must match',
    path: ['confirmAccountNumber'],
  });

  const submitVerification = async (req, res) => {
    try {
      const validatedData = verificationbody.parse(req.body);
  
      const { 
        aadharCardNumber, 
        accountNumber, 
        ifscCode, 
        bankDocument, 
        aadharCardFile 
      } = validatedData;
  
      const { artistId } = req.params;
  
      // Find and update the artist
      const updatedArtist = await Artist.findByIdAndUpdate(
        artistId,
        {
          verificationDocuments: {
            bankDocument,
            aadharCardFile,
          },
          bankDetails: {
            accountNumber,
            ifscCode,
          },
          aadharCardNumber,
          verificationStatus: "pending", // Mark as pending after submission
        },
        { new: true }
      );
  
      // Check if artist was found
      if (!updatedArtist) {
        return res.status(404).json({ error: 'Artist not found.' });
      }
  
      res.status(200).json({
        message: 'Verification details submitted successfully. Awaiting approval.',
        artist: updatedArtist,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
  
      console.error(error);
      res.status(500).json({ error: 'An error occurred while submitting verification details.' });
    }
  };

const getCurrentArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.id)
      .select('-password') // Exclude password from the response
      .select('-resetPasswordToken') // Exclude reset token if you have one
      .select('-resetPasswordExpires'); // Exclude reset token expiry if you have one

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    
    if (!public_id) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    // Delete from Cloudinary
    const cloudinary = require('cloudinary').v2;
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      throw new Error('Failed to delete image from Cloudinary');
    }
  } catch (error) {
    console.error('Error in deleteImage:', error);
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
  submitVerification,
  getCurrentArtist,
  deleteImage,
};
