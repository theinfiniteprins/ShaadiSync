const User = require('../models/User.model');
const cloudinary = require('cloudinary').v2;
const config = require('../configs/config');

// Configure cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

// 1. Create a new user
const createUser = async (req, res) => {
  try {
    const { email, password, mobileNumber, name, address, SyncCoin, isAdmin } = req.body;

    // Prepare user data
    const userData = {
      email,
      password,
      mobileNumber,
      name,
      address,
      SyncCoin,
    };

    // Add isAdmin only if it's explicitly provided as true
    if (isAdmin === true) {
      userData.isAdmin = true;
    }

    const user = new User(userData);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Dynamically add isBlocked only for admin users
    if (user.isAdmin) {
      user._isBlocked = req.query.blocked === 'true'; // Example: Set via query param or external logic
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Block a user (only admin users can be blocked)
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the 'isBlocked' field exists, and set it to true if not.
    if (user.isBlocked === undefined) {
      user.isBlocked = true; // Add the field if it doesn't exist.
    } else {
      // If it already exists, just update it to true to block the user.
      user.isBlocked = true;
    }

    const blockedUser = await user.save(); // Save the updated user document.

    res.status(200).json({ message: 'User blocked successfully', blockedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// 5. Unblock a user (only admin users can be unblocked)
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = false; // Unset isBlocked dynamically
    res.status(200).json({ message: 'User unblocked successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 6. Update a user
const updateUser = async (req, res) => {
  try {
    const { mobileNumber, name, address, profilePic, isAdmin, SyncCoin } = req.body;

    // Prepare update object with basic user fields
    const updates = { 
      mobileNumber, 
      name, 
      address,
    };

    // Only update profilePic if it's provided
    if (profilePic) {
      updates.profilePic = profilePic;
    }

    // Admin-only updates
    // First check if req.user exists and has isAdmin property
    if (req.user && req.user.isAdmin === true) {
      if (typeof isAdmin === 'boolean') {
        updates.isAdmin = isAdmin;
      }
      if (typeof SyncCoin === 'number') {
        updates.SyncCoin = SyncCoin;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({ error: error.message });
  }
};

// 7. Delete a user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this to your existing controller
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    
    // Call Cloudinary API to delete the image
    const result = await cloudinary.uploader.destroy(public_id);
    
    res.status(200).json({ message: 'Image deleted successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  getCurrentUser,
  deleteImage,
};
