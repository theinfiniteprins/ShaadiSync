const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
} = require('../controllers/User.controller');

router.post('/', createUser); // Create new user
router.get('/', getAllUsers); // Get all users
router.get('/:id', getUserById); // Get user by ID
router.put('/:id', updateUser); // Update user
router.delete('/:id', deleteUser); // Delete user
router.put('/:id/block', blockUser); // Block user
router.put('/:id/unblock', unblockUser); // Unblock user

module.exports = router;
