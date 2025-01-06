const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByArtist,
  getReviewsByUser,
  deleteReview,
  updateReview,
} = require('../controllers/Review.controller');

router.post('/', createReview);
router.get('/artist/:artistId', getReviewsByArtist);
router.get('/user/:userId', getReviewsByUser);
router.delete('/:id', deleteReview);
router.put('/:id', updateReview);

module.exports = router;
