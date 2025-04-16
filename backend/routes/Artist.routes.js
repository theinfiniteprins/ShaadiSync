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
  deleteImage,
  changePassword,
  getPendingVerifications,
  handleVerification,
  addcods,
  getNearestArtists,
  getArtistByArtistId,
} = require('../controllers/Artist.controller');

const { authMiddleware } = require("../middleware/authmiddleware");
const { isAdminMiddleware } = require("../middleware/adminmiddleware");



// Public Routes
router.post('/', createArtist); // Create artist
router.post('/addcods', addcods); // Add CODS
router.get('/nearest', getNearestArtists); // Get nearest artists
router.get('/artist/:id', getArtistByArtistId); // Get artist by custom artistId

// Protected Routes (Require Authentication)
router.use(authMiddleware);

router.get('/me', getCurrentArtist); // Get current artist
router.get('/:id', getArtistById); // Get artist by ID
router.put('/:id', updateArtist); // Update artist
router.put('/change-password', changePassword); // Change password
router.post('/delete-image', deleteImage); // Delete image
router.get('/viewbalance/balance', viewBalance); // Get artist balance
router.post('/verification/submit', submitVerification); // Submit verification request

// Admin Protected Routes
router.use(isAdminMiddleware);

router.get('/pending-verifications', getPendingVerifications); // Get pending verifications
router.put('/verify/:artistId', handleVerification); // Handle verification
router.put('/:id/verify', updateIsVerified); // Update artist verification status
router.get('/', getAllArtists); // Get all artists
router.delete('/:id', deleteArtist); // Delete artist
router.put('/:id/block', blockArtist); // Block artist
router.put('/:id/unblock', unblockArtist); // Unblock artist

// Dynamic Routes (Placed at the Bottom to Prevent Conflicts)



module.exports = router;
