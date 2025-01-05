const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Review Schema
const reviewSchema = new Schema(
  {
    artistId: {
      type: Schema.Types.ObjectId, // Reference to the Artist model
      ref: 'Artist',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true, // Rating is mandatory
      min: 1, // Minimum rating value
      max: 5, // Maximum rating value
    },
    reviewText: {
      type: String,
      default: '', // Optional review text
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only include createdAt field
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
