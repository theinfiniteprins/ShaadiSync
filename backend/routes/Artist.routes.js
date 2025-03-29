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
} = require('../controllers/Artist.controller');

const { authMiddleware } = require("../middleware/authmiddleware");
const { isAdminMiddleware } = require("../middleware/adminmiddleware")

router.post('/', createArtist);

router.get('/pending-verifications',authMiddleware,isAdminMiddleware, getPendingVerifications);
router.put('/verify/:artistId', authMiddleware,isAdminMiddleware, handleVerification);
router.get('/me', authMiddleware, getCurrentArtist);
router.get('/:id', authMiddleware, getArtistById); 
router.put('/change-password', authMiddleware, changePassword);
router.put('/:id', authMiddleware, updateArtist); // Update artist
router.get('/viewbalance/balance', authMiddleware, viewBalance); // Get artist balance
// router.put('/submit-verify/kaan', authMiddleware, submitVerification); // Unblock artist

router.post('/verification/submit', authMiddleware, submitVerification);

router.put('/:id/verify', authMiddleware,isAdminMiddleware, updateIsVerified); // Update artist verification status
router.get('/', authMiddleware, isAdminMiddleware, getAllArtists); // Get all artists
router.delete('/:id', authMiddleware, isAdminMiddleware, deleteArtist); // Delete artist
router.put('/:id/block', authMiddleware, isAdminMiddleware, blockArtist); // Block artist
router.put('/:id/unblock', authMiddleware, isAdminMiddleware, unblockArtist); // Unblock artist
router.post('/delete-image', authMiddleware, deleteImage);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
