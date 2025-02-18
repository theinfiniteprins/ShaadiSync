const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the ArtistType Schema
const artistTypeSchema = new Schema(
  {
    //artistType
    type: {
      type: String,
      required: true,
      unique: true, // Each type should be unique
    },
    typeimg: {
      type: String, // This can store the URL or file path for the profile picture
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const ArtistType = mongoose.model('ArtistType', artistTypeSchema);

module.exports = ArtistType;