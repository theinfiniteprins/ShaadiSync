const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const otpGenerator = require("otp-generator")
const { mailSender } = require("../config/mailSender");
const OTP = require("../models/Otp.model");
require("dotenv").config();

const { authmiddleware } = require("../middleware/authmiddleware");



const sendOTPBody = zod.object({
    email: zod.string().email(),
})

const sendOTP = async (req, res) => {
    const { success } = sendOTPBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    console.log(email);
    const existingUser = await User.findOne({
        email
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email not found"
        })
    }



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

const signupBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    confirmPassword: zod.string(),
    otp: zod.string().length(6),

})


const signup = async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const { email, password, confirmPassword, otp } = req.body;

    if (password !== confirmPassword) {
        return res.status(411).json({
            message: "Both password should be same"
        })
    }

    const existingUser = await User.findOne({
        email
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const recentOtp = await OTP.findOne({ email })
        .sort({ createdAt: -1 })
        .limit(1);



    if (recentOtp.length === 0) {
        return res.status(400).json({
            success: false,
            message: "OTP not found",
        });
    } else if (otp !== recentOtp.otp) {
        return res.status(400).json({
            success: false,
            message: "Invaild OTP",
        });
    }
    const newUser = await User.create({
        email,
        password,
        mobileNumber:9999999999,
    });

    recentOtp.used = true;
    await recentOtp.save();

    res.status(200).json({
        success: true,
        message: "User created successfully",
    });


};

const signinBody = zod.object({
    email: zod.string().email(),
	password: zod.string()
})


const signin = async (req,res) =>{
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id 
        }, process.env.JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })
};


module.exports = {
    sendOTP,
    signup,
    signin,
};

