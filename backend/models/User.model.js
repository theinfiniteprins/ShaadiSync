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
      default: 0,  // Set default to 0 or any initial value
    },
    isBlocked: {
      type: Boolean,
      default: false, // Blocked status will not be stored in the DB, it will be added dynamically
      select: false,  // This will prevent it from being included in the response unless specifically queried
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create a virtual field for isBlocked that won't be saved in DB
userSchema.virtual('isBlocked').get(function() {
  return this.__isBlocked;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
