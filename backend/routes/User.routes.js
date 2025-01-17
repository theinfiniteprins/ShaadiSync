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

const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.post('/', createUser); // Create new user
router.get('/:id', getUserById); // Get user by ID

router.put('/:id', authMiddleware, updateUser); // Update user

router.get('/', authMiddleware, isAdminMiddleware, getAllUsers); // Get all users
router.delete('/:id', authMiddleware, isAdminMiddleware, deleteUser); // Delete user
router.put('/:id/block', authMiddleware, isAdminMiddleware, blockUser); // Block user
router.put('/:id/unblock', authMiddleware, isAdminMiddleware, unblockUser); // Unblock user

module.exports = router;
