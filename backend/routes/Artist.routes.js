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
  submitVerification
} = require('../controllers/Artist.controller');

const { authMiddleware } = require("../middleware/authmiddleware");
const { isAdminMiddleware } = require("../middleware/adminmiddleware")

router.post('/', createArtist);

router.get('/:id', authMiddleware, getArtistById); 
router.put('/:id', authMiddleware, updateArtist); // Update artist
router.get('/:id/balance', authMiddleware, viewBalance); // Get artist balance
router.put('/:id/submit-verify', authMiddleware, submitVerification); // Unblock artist

//add authMiddleware, isAdminMiddleware, into verify,block,unblock,getAllArtists
router.put('/:id/verify',  updateIsVerified); // Update artist verification status
router.get('/', getAllArtists); // Get all artists
router.delete('/:id', authMiddleware, isAdminMiddleware, deleteArtist); // Delete artist
router.put('/:id/block',  blockArtist); // Block artist
router.put('/:id/unblock',  unblockArtist); // Unblock artist

module.exports = router;
