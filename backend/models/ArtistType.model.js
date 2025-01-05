const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the ArtistType Schema
const artistTypeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true, // Each type should be unique
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const ArtistType = mongoose.model('ArtistType', artistTypeSchema);

module.exports = ArtistType;
