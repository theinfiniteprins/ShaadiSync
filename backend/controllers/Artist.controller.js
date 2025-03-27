const Artist = require('../models/Artist.model'); // Replace with the actual path to your Artist model
const ArtistType = require('../models/ArtistType.model'); // Replace with the actual path to your ArtistType model
const zod = require("zod");
const bcrypt = require('bcrypt');

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
      .populate('artistType', 'type') // Populate artistType with its name
      .select('-password +isBlocked'); // Exclude password field
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


const submitVerification = async (req, res) => {
  try {
    const { 
      aadharCardNumber, 
      bankDetails,
      verificationDocuments 
    } = req.body;
    

    // Validate required fields
    if (!aadharCardNumber || !bankDetails || !verificationDocuments) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Validate bank details
    if (!bankDetails.accountNumber || !bankDetails.ifscCode) {
      return res.status(400).json({ 
        error: 'Bank account number and IFSC code are required' 
      });
    }

    // Validate document URLs
    if (!verificationDocuments.bankDocument || !verificationDocuments.aadharCardFile) {
      return res.status(400).json({ 
        error: 'Both bank document and Aadhar card document are required' 
      });
    }

    // Find and update the artist
    const updatedArtist = await Artist.findByIdAndUpdate(
      req.id, // Using req.id directly as it contains the artist ID
      {
        verificationDocuments: {
          bankDocument: verificationDocuments.bankDocument,
          aadharCardFile: verificationDocuments.aadharCardFile,
        },
        bankDetails: {
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
        },
        aadharCardNumber,
        verificationStatus: "pending", // Mark as pending after submission
        isVerified: false, // Ensure verified status is false until approved
      },
      { 
        new: true,
        runValidators: true // Run model validators
      }
    );

    if (!updatedArtist) {
      return res.status(404).json({ 
        error: 'Artist not found' 
      });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Verification details submitted successfully. Awaiting approval.',
      artist: {
        id: updatedArtist._id,
        verificationStatus: updatedArtist.verificationStatus,
        isVerified: updatedArtist.isVerified
      }
    });

  } catch (error) {
    console.error('Verification submission error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors.map(err => ({
          path: err.path,
          message: err.message,
        }))
      });
    }

    res.status(500).json({ 
      error: 'An error occurred while submitting verification details' 
    });
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

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const artistId = req.id;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, artist.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    artist.password = hashedPassword;
    await artist.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

const getPendingVerifications = async (req, res) => {
  try {
    const pendingArtists = await Artist.find({ verificationStatus: "pending" })
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .populate('artistType', 'type');

    if (!pendingArtists.length) {
      return res.status(200).json({
        success: true,
        message: 'No pending verifications found',
        artists: []
      });
    }

    res.status(200).json({
      success: true,
      count: pendingArtists.length,
      artists: pendingArtists
    });

  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending verifications'
    });
  }
};

const handleVerification = async (req, res) => {
  try {
    const { artistId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be either "approved" or "rejected"'
      });
    }

    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({
        success: false,
        error: 'Artist not found'
      });
    }

    // Update verification status
    const updates = {
      verificationStatus: status,
      isVerified: status === 'approved'
    };

    // If rejected, clear verification documents
    if (status === 'rejected') {
      updates.verificationDocuments = {
        bankDocument: null,
        aadharCardFile: null
      };
      updates.bankDetails = {
        accountNumber: null,
        ifscCode: null
      };
      updates.aadharCardNumber = null;
    }

    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      updates,
      { new: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    res.status(200).json({
      success: true,
      message: `Artist verification ${status} successfully`,
      artist: updatedArtist
    });

  } catch (error) {
    console.error('Error handling verification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process verification'
    });
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
  changePassword,
  getPendingVerifications,
  handleVerification
};
