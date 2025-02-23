const express = require('express');
const router = express.Router();
const {
  unlockService,
  isServiceUnlocked,
  getUnlockedServices,
  getUserByService,
  getLatestUnlockedLead,
  getMonthlyLeadsByArtist,
  getUnlockStatsByArtist,
} = require('../controllers/UserUnlockService.controller');

const {authMiddleware} = require("../middleware/authmiddleware"); 

router.post('/unlock', authMiddleware, unlockService);
router.get('/is-unlocked/:userId/:serviceId', authMiddleware, isServiceUnlocked);
router.get('/unlocked-service/:userId', authMiddleware, getUnlockedServices);
router.get('/service-users/:serviceId', authMiddleware, getUserByService);
router.get('/artist/getLatestLead', authMiddleware, getLatestUnlockedLead);
router.get('/artist/getLeadsGraph', authMiddleware,getMonthlyLeadsByArtist );
router.get('/artist/getUnlockStats', authMiddleware,getUnlockStatsByArtist );

module.exports = router;