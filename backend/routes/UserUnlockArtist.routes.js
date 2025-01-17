const express = require('express');
const router = express.Router();
const {
  unlockArtist,
  isArtistUnlocked,
  getUnlockedArtists,
} = require('../controllers/UserUnlockArtist.controller');

const {authMiddleware} = require("../middleware/authmiddleware");

router.post('/unlock', authMiddleware, unlockArtist);
router.get('/is-unlocked/:userId/:artistId', authMiddleware, isArtistUnlocked);
router.get('/unlocked-artists/:userId', authMiddleware, getUnlockedArtists);

module.exports = router;
