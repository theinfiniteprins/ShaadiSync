const Artist = require('../models/Artist.model'); // Replace with the actual path to your Artist model
const ArtistType = require('../models/ArtistType.model'); // Replace with the actual path to your ArtistType model
const zod = require("zod");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const axios = require('axios');
const Service = require('../models/Service.model');

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

    const defaultProfilePic = "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360";

    const newArtist = new Artist({
      email,
      password,
      name,
      mobileNumber,
      artistType,
      address,
      profilePic: profilePic || defaultProfilePic,
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
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find and delete artist
      const deletedArtist = await Artist.findById(req.params.id).session(session);
      
      if (!deletedArtist) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Artist not found' });
      }

      // Delete all services associated with the artist
      await Service.deleteMany({ artistId: req.params.id }).session(session);

      // Delete the artist
      await deletedArtist.deleteOne();

      // Commit the transaction
      await session.commitTransaction();
      
      res.status(200).json({ 
        message: 'Artist and associated services deleted successfully'
      });

    } catch (error) {
      // If any error occurs, abort transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End session
      session.endSession();
    }

  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to delete artist and services' 
    });
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
    const artistId = req.id;
    const { aadharCardNumber, bankDetails, verificationDocuments } = req.body;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Update artist verification details
    artist.aadharCardNumber = aadharCardNumber;
    artist.bankDetails = bankDetails;
    artist.verificationDocuments = verificationDocuments;
    artist.verificationStatus = 'pending';
    
    await artist.save();

    res.status(200).json({ 
      message: 'Verification details submitted successfully',
      verificationStatus: 'pending'
    });
  } catch (error) {
    console.error('Verification submission error:', error);
    res.status(500).json({ 
      message: 'Failed to submit verification details',
      error: error.message 
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
      .populate('artistType');

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







async function getCoordinatesFromNominatim(address) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'ShadiSync/1.0' 
      }
    });
    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return {
        city: location.display_name.split(',')[0],
        coordinates: [parseFloat(location.lon), parseFloat(location.lat)] // GeoJSON format
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address with Nominatim:', error.message);
    return null;
  }
}

async function updateArtistsWithCoordinates() {
  try {
    // Find all artists without coordinates
    const artists = await Artist.find({
      'coordinates': { $exists: false }
    });

    console.log(`Found ${artists.length} artists without coordinates`);

    for (const artist of artists) {
      const address = artist.address || '';
      if (!address) {
        console.log(`Artist ${artist.name || artist._id} has no address specified`);
        continue;
      }
      const addressParts = artist.address.trim().split(/\s+/);
      const city = addressParts[addressParts.length - 1];
      console.log(city);

      console.log(`Processing artist: ${artist.name || artist._id}`);

      // Get coordinates using Google Maps API
      // const locationData = await getCoordinates(address);
      
      // OR use free Nominatim API
      const locationData = await getCoordinatesFromNominatim(city);
      console.log(locationData);

      if (locationData) {
        // Update artist with location data
        artist.coordinates = {
          type: 'Point',
          coordinates: locationData.coordinates // [longitude, latitude]
        };

        await artist.save();
        console.log(`Updated ${artist.name || artist._id} with coordinates: [${locationData.coordinates}]`);
      } else {
        console.log(`Failed to geocode address for ${artist.name || artist._id}`);
      }

      // Add delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Finished updating artists with coordinates');
  } catch (error) {
    console.error('Error updating artists:', error);
  }
}

const addcods = async (req, res) => {
  try {
    await updateArtistsWithCoordinates();
  } catch (error) {
    console.error('Error in addcods:', error);
  }
}



function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon1 - lon2);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI/180);
}

const getNearestArtists = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    // Validate coordinates
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        error: 'Longitude and latitude are required'
      });
    }

    // Convert coordinates to numbers
    const coords = [parseFloat(longitude), parseFloat(latitude)];

    // Find nearest artists using MongoDB's geospatial query
    const nearestArtists = await Artist.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coords
          },
          $maxDistance: 50000 // 50km radius
        }
      },
      isVerified: true, // Only get verified artists
      isBlocked: false // Exclude blocked artists
    })
    .select('-password -verificationDocuments -bankDetails -aadharCardNumber')
    .populate('artistType', 'type')
    .limit(10);
    // Calculate distance for each artist
    const artistsWithDistance = nearestArtists.map(artist => {
      const distance = calculateDistance(
        coords[1], coords[0],
        artist.coordinates.coordinates[1],
        artist.coordinates.coordinates[0]
      );

      return {
        ...artist.toObject(),
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
      };
    });

    res.status(200).json({
      success: true,
      count: artistsWithDistance.length,
      artists: artistsWithDistance
    });

  } catch (error) {
    console.error('Error finding nearest artists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to find nearest artists'
    });
  }
};


const getArtistByArtistId = async (req, res) => {
  try {
    // Only select fields that are used in the ArtistDetails component
    const artist = await Artist.findById(req.params.id)
      .populate('artistType', 'type')
      .select([
        'name',
        'profilePic',
        'artistType',
        'isVerified',
        'description'
      ]);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Return only the necessary fields in a structured response
    res.status(200).json(artist);

  } catch (error) {
    console.error('Error fetching artist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artist details',
      error: error.message
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
  handleVerification,
  addcods,
  getCoordinatesFromNominatim,
  getNearestArtists,
  getArtistByArtistId,
};
