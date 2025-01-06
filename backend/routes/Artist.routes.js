const express = require('express');
const router = express.Router();
const {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  blockArtist,
  unblockArtist,
  viewBalance,
  updateIsVerified,
} = require('../controllers/Artist.controller');

router.post('/', createArtist); // Create new artist
router.get('/', getAllArtists); // Get all artists
router.get('/:id', getArtistById); // Get artist by ID
router.put('/:id', updateArtist); // Update artist
router.delete('/:id', deleteArtist); // Delete artist
router.put('/:id/block', blockArtist); // Block artist
router.put('/:id/unblock', unblockArtist); // Unblock artist
router.get('/:id/balance', viewBalance); // Get artist balance
router.put('/:id/verify', updateIsVerified); // Update artist verification status

module.exports = router;
