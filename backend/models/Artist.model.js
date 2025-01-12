const mongoose = require('mongoose');
const { Schema } = mongoose;
const ArtistType = require('./ArtistType.model');  // Import the ArtistType model

// Define the Artist Schema
const artistSchema = new Schema(
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
    name: {
      type: String,
    },
    mobileNumber: {
      type: String,
      unique: true,
    },
    artistType: {
      type: Schema.Types.ObjectId,  // Reference to ArtistType model
      ref: 'ArtistType',            // Reference to the ArtistType model
      required: true,
    },
    address: {
      type: String,
    },
    profilePic: {
      type: String, // This can store the URL or file path for the profile picture
    },
    description: {
      type: String,
      default: '', // Optional field
    },
    certificates: {
      type: [String], // Store URLs or file paths for certificates
      default: [],
    },
    isBlocked: {
      type: Boolean,
      default: false, // Blocked status
      select: false, // Prevent it from being included unless specifically requested
    },
    isVerified: {
      type: Boolean,
      default: false, // Indicates if the artist is verified
    },
    balance: {
      type: Number,
      default: 0, // Artist's wallet balance
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create a virtual field for isBlocked that won't be saved in DB
// artistSchema.virtual('isBlocked').get(function () {
//   return this.__isBlocked;
// });

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
