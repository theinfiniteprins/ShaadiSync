const mongoose = require('mongoose');
const { Schema } = mongoose;
const ArtistType = require('./ArtistType.model'); // Import the ArtistType model

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
      required: true,
      unique: true,
    },
    artistType: {
      type: Schema.Types.ObjectId,
      ref: 'ArtistType',
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
    isBlocked: {
      type: Boolean,
      default: false, // Blocked status
      select: false, // Prevent it from being included unless specifically requested
    },
    isVerified: {
      type: Boolean,
      default: false, // Indicates if the artist is verified
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
    },
    balance: {
      type: Number,
      default: 0, // Artist's wallet balance
    },
    maxCharge: {
      type: Number,
      default: 0,
    },
    verificationDocuments: {
      bankDocument: {
        type: String, // Store URL or file path for bank document
      },
      aadharCardFile: {
        type: String, // Store URL or file path for Aadhar card document
      },
    },
    bankDetails: {
      accountNumber: {
        type: String, // Bank account number
        trim: true,
      },
      ifscCode: {
        type: String, // IFSC code
        trim: true,
      },
    },
    aadharCardNumber: {
      type: String, // Aadhar card number
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
