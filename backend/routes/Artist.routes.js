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

const { authMiddleware } = require("../middleware/authmiddleware");
const { isAdminMiddleware } = require("../middleware/adminmiddleware")

router.post('/', createArtist); // Create new artist

router.get('/:id', authMiddleware, getArtistById); // Get artist by ID
router.put('/:id', authMiddleware, updateArtist); // Update artist
router.get('/:id/balance', authMiddleware, viewBalance); // Get artist balance
router.put('/:id/verify', authMiddleware, updateIsVerified); // Update artist verification status

router.get('/', authMiddleware, isAdminMiddleware, getAllArtists); // Get all artists
router.delete('/:id', authMiddleware, isAdminMiddleware, deleteArtist); // Delete artist
router.put('/:id/block', authMiddleware, isAdminMiddleware, blockArtist); // Block artist
router.put('/:id/unblock', authMiddleware, isAdminMiddleware, unblockArtist); // Unblock artist


module.exports = router;
