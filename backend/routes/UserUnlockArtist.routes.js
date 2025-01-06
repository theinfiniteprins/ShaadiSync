const express = require('express');
const router = express.Router();
const {
  unlockArtist,
  isArtistUnlocked,
  getUnlockedArtists,
} = require('../controllers/UserUnlockArtist.controller');

router.post('/unlock', unlockArtist);
router.get('/is-unlocked/:userId/:artistId', isArtistUnlocked);
router.get('/unlocked-artists/:userId', getUnlockedArtists);

module.exports = router;
