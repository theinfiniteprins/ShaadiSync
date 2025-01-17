const express = require('express');
const router = express.Router();
const {
  sendOTP,
  signup,
} = require('../auth/signup');
const { signin} = require('../auth/signin');

const {isAdminMiddleware} = require("../middleware/adminmiddleware")
const {authMiddleware } = require("../middleware/authmiddleware")

router.post('/sendotp', sendOTP);
router.post('/signup',signup);
router.post('/signin',signin);
router.get("/isAdmin",authMiddleware,isAdminMiddleware)


module.exports = router;
