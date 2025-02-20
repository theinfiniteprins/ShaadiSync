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
  submitVerification,
  getCurrentArtist,
  deleteImage
} = require('../controllers/Artist.controller');

const { authMiddleware } = require("../middleware/authmiddleware");
const { isAdminMiddleware } = require("../middleware/adminmiddleware")

router.post('/', createArtist);

router.get('/me', authMiddleware, getCurrentArtist);
router.get('/:id', authMiddleware, getArtistById); 
router.put('/:id', authMiddleware, updateArtist); // Update artist
router.get('/viewbalance/balance', authMiddleware, viewBalance); // Get artist balance
router.put('/:id/submit-verify', authMiddleware, submitVerification); // Unblock artist


router.put('/:id/verify', authMiddleware,isAdminMiddleware, updateIsVerified); // Update artist verification status
router.get('/', authMiddleware, isAdminMiddleware, getAllArtists); // Get all artists
router.delete('/:id', authMiddleware, isAdminMiddleware, deleteArtist); // Delete artist
router.put('/:id/block', authMiddleware, isAdminMiddleware, blockArtist); // Block artist
router.put('/:id/unblock', authMiddleware, isAdminMiddleware, unblockArtist); // Unblock artist
router.post('/delete-image', authMiddleware, deleteImage);
// Get current artist profile

module.exports = router;
