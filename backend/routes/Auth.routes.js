const express = require('express');
const router = express.Router();
const {
  sendOTP,
} = require('../auth/Usersignup');

router.post('/sendotp', sendOTP);


module.exports = router;
