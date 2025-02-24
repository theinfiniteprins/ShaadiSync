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
  getCurrentUser,
  deleteImage,
  viewBalance,
} = require('../controllers/User.controller');

const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.post('/', createUser); // Create new user
router.get('/me', authMiddleware, getCurrentUser);
router.get('/getuserbyid/:id',authMiddleware, getUserById); // Get user by ID
router.get('/getBalance',authMiddleware, viewBalance); // Get user by ID

router.put('/:id', authMiddleware, updateUser); // Update user

// add authMiddleware, isAdminMiddleware, in getAllUsers,deleteUser
router.get('/', authMiddleware,  isAdminMiddleware, getAllUsers); // Get all users
router.delete('/:id',authMiddleware, isAdminMiddleware, deleteUser); // Delete user
router.put('/:id/block', authMiddleware, isAdminMiddleware, blockUser); // Block user
router.put('/:id/unblock', authMiddleware, isAdminMiddleware, unblockUser); // Unblock user
router.post('/delete-image', authMiddleware, deleteImage);

module.exports = router;
