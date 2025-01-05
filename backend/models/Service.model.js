const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Service Schema
const serviceSchema = new Schema(
  {
    artistId: {
      type: Schema.Types.ObjectId, // Reference to the Artist model
      ref: 'Artist',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true, // Price is mandatory
    },
    description: {
      type: String,
      default: '', // Optional description
    },
    photos: {
      type: [String], // Array of URLs or file paths for photos
      default: [],
    },
    videos: {
      type: [String], // Array of URLs or file paths for videos
      default: [],
    },
    isLive: {
      type: Boolean,
      default: false, // Indicates whether the service is currently live
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
