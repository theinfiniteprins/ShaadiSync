const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the UserUnlockService Schema
const userUnlockServiceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId, // Reference to the Service model
      ref: 'Service',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only include createdAt
  }
);

const UserUnlockService = mongoose.model('UserUnlockService', userUnlockServiceSchema);

module.exports = UserUnlockService;