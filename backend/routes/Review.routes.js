const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByArtist,
  getReviewsByUser,
  deleteReview,
  updateReview,
} = require('../controllers/Review.controller');

const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.get('/artist/:artistId', getReviewsByArtist);

router.post('/', authMiddleware, createReview);
router.get('/user/:userId', authMiddleware, getReviewsByUser);
router.put('/:id', authMiddleware, updateReview);

router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;

