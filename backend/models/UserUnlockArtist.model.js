const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the UserUnlockArtist Schema
const userUnlockArtistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },
    artistId: {
      type: Schema.Types.ObjectId, // Reference to the Artist model
      ref: 'Artist',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only include createdAt
  }
);

const UserUnlockArtist = mongoose.model('UserUnlockArtist', userUnlockArtistSchema);

module.exports = UserUnlockArtist;
