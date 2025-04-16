const User = require('../models/User.model');
const cloudinary = require('cloudinary').v2;
const config = require('../configs/config');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Configure cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Remove or update the passport strategy since we're using auth code flow
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
            profilePic: profile.photos[0].value,
            authProvider: 'google',
            isEmailVerified: true,
            SyncCoin: 10
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

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
    const unblockedUser = await user.save(); // Save the updated user document.
    res.status(200).json({ message: 'User unblocked successfully', unblockedUser });
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
    console.log("public_id",public_id);
    // Call Cloudinary API to delete the image
    const result = await cloudinary.uploader.destroy(public_id);
    
    res.status(200).json({ message: 'Image deleted successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const viewBalance = async (req, res) => {
  try {
    const user = await User.findById(req.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({SyncCoin :user.SyncCoin});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
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
    user.password = hashedPassword;
    await user.save();

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

// Add these new controller functions

const googleCallback = async (req, res) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err) {
      console.log('Google authentication error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication failed' 
      });
    }

    // Generate JWT token
   const token = jwt.sign({ userId: user._id,role: 'user' }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        SyncCoin: user.SyncCoin
      }
    });
  })(req, res);
};

// Update the Google authentication controller
const googleAuth = async (req, res) => {
  try {
    const { code } = req.body;

    // Exchange auth code for tokens
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    // Check if user exists by email or googleId
    let user = await User.findOne({
      $or: [
        { email: payload.email },
        { googleId: payload.sub }
      ]
    });

    if (!user) {
      // Create new user with Google credentials
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        profilePic: payload.picture,
        authProvider: 'google',
        isEmailVerified: true,
        SyncCoin: 10
      });
      await user.save();
    } else if (!user.googleId) {
      // If user exists but doesn't have googleId (registered through email)
      user.googleId = payload.sub;
      user.authProvider = 'google';
      user.isEmailVerified = true;
      if (!user.profilePic) {
        user.profilePic = payload.picture;
      }
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id,role: 'user' }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        SyncCoin: user.SyncCoin,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
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
  viewBalance,
  changePassword,
  googleCallback,
  googleAuth,
};
