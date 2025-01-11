const express = require('express');
const router = express.Router();
const {
  sendOTP,
  signup,
  signin,
} = require('../auth/Usersignup');
const {isAdminMiddleware} = require("../middleware/adminmiddleware")
const {authMiddleware } = require("../middleware/authmiddleware")

router.post('/sendotp', sendOTP);
router.post('/signup',signup);
router.post('/signin',signin);
router.get("/isAdmin",authMiddleware,isAdminMiddleware)


module.exports = router;
