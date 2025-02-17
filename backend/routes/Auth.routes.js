const express = require('express');
const router = express.Router();
const {
  sendOTP,
  signup,
  createArtistProfile,
} = require('../auth/signup');
const { signin} = require('../auth/signin');

const {isAdminMiddleware} = require("../middleware/adminmiddleware")
const {authMiddleware } = require("../middleware/authmiddleware")
const {verifyToken} = require("../middleware/ArtistVerification")

router.post('/sendotp', sendOTP);
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/createArtist',verifyToken,createArtistProfile);
router.get("/isAdmin",authMiddleware,isAdminMiddleware);


module.exports = router;
