const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {User} = require("../models/User.model");
const otpGenerator = require("otp-generator")
const { mailSender } = require("../config/mailSender");
const OTP = require("../models/Otp.model");

const {authmiddleware} = require("../middleware/authmiddleware");


const signupBody = zod.object({
    email: zod.string().email(),
	password: zod.string(),
    confirmPassword: zod.string(),

})

const sendOTPBody = zod.object({
    email: zod.string().email(),
})  

const sendOTP = async (req, res) => {
    const {success} = sendOTPBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    // const existingUser = await User.findOne({
    //     email: req.body.email
    // })

    // if (!existingUser) {
    //     return res.status(411).json({
    //         message: "Email not found"
    //     })
    // }

    const { email } = req.body;
    console.log(email);
    

    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
    
};

// const signup = async (req, res) => {
//     const { success } = signupBody.safeParse(req.body)
//     if (!success) {
//         return res.status(411).json({
//             message: "Email already taken / Incorrect inputs"
//         })
//     }

//     const existingUser = await User.findOne({
//         username: req.body.username
//     })

//     if (existingUser) {
//         return res.status(411).json({
//             message: "Email already taken/Incorrect inputs"
//         })
//     }


// };

module.exports = {
    sendOTP,
  };

