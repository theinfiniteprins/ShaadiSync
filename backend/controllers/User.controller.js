const User = require('../models/User.model'); // Replace with the actual path to your User model

// 1. Create a new user
// const createUser = async (req, res) => {
//   try {
//     const { email, password, mobileNumber, name, address, SyncCoin, isAdmin } = req.body;

//     const user = new User({
//       email,
//       password,
//       mobileNumber,
//       name,
//       address,
//       SyncCoin,
//       isAdmin,
//     });

//     const savedUser = await user.save();
//     res.status(201).json(savedUser);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// 2. Get all users (exclude password field)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get a user by ID (exclude password field)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update a user (prevent password updates)
const updateUser = async (req, res) => {
    try {
      const { mobileNumber, name, address } = req.body;
  
      // Validate only allowed fields: mobileNumber, name, and address
      const updates = { mobileNumber, name, address };
  
      // Ensure no unauthorized fields are passed (password and email cannot be updated)
      const validFields = ['mobileNumber', 'name', 'address'];
      Object.keys(req.body).forEach((field) => {
        if (!validFields.includes(field)) {
          delete updates[field];
        }
      });
  
      // Update user in the database
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password'); // Exclude password field
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// 5. Delete a user
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

// 6. Block a user
const blockUser = async (req, res) => {
  try {
    const blockedUser = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true }).select('-password'); // Exclude password field
    if (!blockedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User blocked successfully', blockedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 7. Unblock a user
const unblockUser = async (req, res) => {
  try {
    const unblockedUser = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true }).select('-password'); // Exclude password field
    if (!unblockedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User unblocked successfully', unblockedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
};
