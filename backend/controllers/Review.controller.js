const Review = require("../models/Review.model");
const Artist = require("../models/Artist.model");
const User = require("../models/User.model");

const createReview = async (req, res) => {
  try {
    const { artistId, rating, reviewText } = req.body;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const newReview = new Review({ artistId, userId: req.id, rating, reviewText });
    const savedReview = await newReview.save();

    res.status(201).json({ message: "Review created successfully", savedReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;
    console.log("Received artistId:", artistId);

    const reviews = await Review.find({ artistId: artistId }).populate("userId", "name email");

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this artist." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reviews = await Review.find({ userId }).populate("artistId", "name");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    console.log("Received delete request");

    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, reviewText },
      { new: true }
    ).populate("userId", "name email").populate("artistId", "name");

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review updated successfully", updatedReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get average rating and total reviews for an artist
const getAverageRatingByArtist = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch all reviews for the artist
    const reviews = await Review.find({ artistId : id });

    if (reviews.length === 0) {
      return res.json({ totalReviews: 0, averageRating: 0 });
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    res.status(200).json({ totalReviews: reviews.length, averageRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByArtist,
  getReviewsByUser,
  deleteReview,
  updateReview,
  getAverageRatingByArtist,
};
