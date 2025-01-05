const express = require("express");
const router = express.Router();

const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  blockUser, 
  unblockUser 
} = require("../controllers/User.controller");

// Define routes
router.get("/users", getAllUsers);  // Get all users
router.get("/user/:id", getUserById);  // Get user by ID
router.put("/user/:id", updateUser);  // Update user
router.delete("/user/:id", deleteUser);  // Delete user
router.put("/user/block/:id", blockUser);  // Block user
router.put("/user/unblock/:id", unblockUser);  // Unblock user

module.exports = router;
