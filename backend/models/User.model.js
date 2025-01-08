const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User Schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    SyncCoin: {
      type: Number,
      default: 0, // Default SyncCoin balance
    },
    isAdmin: {
      type: Boolean,
      default: undefined, // Default undefined; only explicitly set it for admins
    },
    isBlocked: {
      type: Boolean,
      default: undefined, // Default undefined; only explicitly set it for admins
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);


const User = mongoose.model('User', userSchema);

module.exports = User;
