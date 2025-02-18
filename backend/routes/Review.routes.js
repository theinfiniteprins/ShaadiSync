const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByArtist,
  getReviewsByUser,
  deleteReview,
  updateReview,
  getAverageRatingByArtist,
  getReviewsByArtistToken,
} = require('../controllers/Review.controller');

const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.get('/artist/:artistId', getReviewsByArtist);

router.post('/', authMiddleware, createReview);
router.get('/user/:userId', authMiddleware, getReviewsByUser);
router.get('/get-rating/:id', getAverageRatingByArtist);
router.get('/artistreview/get-rating', authMiddleware,getReviewsByArtistToken);
router.put('/:id', authMiddleware, updateReview);

router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;

