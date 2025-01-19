const zod = require("zod");
const User = require("../models/User.model");
const UserTransactionHistory = require("../models/UserTransactionHistory.model");
const otpGenerator = require("otp-generator");
const OTP = require("../models/Otp.model");
require("dotenv").config();
const Artist = require("../models/Artist.model");
const bcrypt = require('bcrypt');

const sendOTPBody = zod.object({
    email: zod.string().email(),
    role: zod.enum(["user", "artist"]),
});

const sendOTP = async (req, res) => {
    try {
        const parsed = sendOTPBody.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Incorrect inputs",
            });
        }

        const { email, role } = req.body;

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let otpPayload = {};
        let message = "";

        if (role === "user") {
            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(404).json({
                        success: false,
                        message: "Email already registered",
                    });
                }
                otpPayload = { email, otp, type: "user-signup" };
                message = "OTP sent successfully for user signup";
            } catch (error) {
                console.error("Error finding user:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while processing user",
                });
            }
        } else if (role === "artist") {
            try {
                const existingArtist = await Artist.findOne({ email });
                if (existingArtist) {
                    return res.status(404).json({
                        success: false,
                        message: "Email already registered",
                    });
                }
                otpPayload = { email, otp, type: "artist-signup" };
                message = "OTP sent successfully for artist signup";
            } catch (error) {
                console.error("Error finding artist:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while processing artist",
                });
            }
        }

        try {
            await OTP.create(otpPayload);
            return res.status(200).json({
                success: true,
                message,
                otp,
            });
        } catch (error) {
            console.error("Error saving OTP:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to save OTP",
            });
        }
    } catch (error) {
        console.error("Error in sendOTP function:", error);
        return res.status(500).json({
            success: false,
            message: "Unexpected server error",
        });
    }
};

const signupBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    confirmPassword: zod.string(),
    otp: zod.string().length(6),
    role: zod.enum(["user", "artist"]),
});

const signup = async (req, res) => {
    try {
        const parsed = signupBody.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Incorrect inputs",
            });
        }

        const { email, password, confirmPassword, otp, role } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let message = "";

        if (role === "user") {
            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already registered",
                    });
                }

                const recentOtp = await OTP.findOne({ email })
                    .sort({ createdAt: -1 })
                    .limit(1);

                if (!recentOtp) {
                    return res.status(404).json({
                        success: false,
                        message: "OTP not found",
                    });
                } else if (otp !== recentOtp.otp) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid OTP",
                    });
                }
                
                var SyncCoin = 10;
                const newUser = await User.create({
                    email,
                    password : hashedPassword,
                    mobileNumber: 99999255251,
                    SyncCoin: SyncCoin,
                });
                
                await UserTransactionHistory.create({
                    userId: newUser._id,
                    amount: 10,
                    syncCoin: SyncCoin,
                    transactionType: "credit",  
                    description: "Initial SyncCoins added on signup", 
                });

                message = "User created successfully and 10 SyncCoins added to your account";
                recentOtp.used = true;
                await recentOtp.save();


            } catch (error) {
                console.error("Error in user signup:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while signing up user",
                });
            }
        } else if (role === "artist") {
            try {
                const existingArtist = await Artist.findOne({ email });
                if (existingArtist) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already registered",
                    });
                }

                const recentOtp = await OTP.findOne({ email })
                    .sort({ createdAt: -1 })
                    .limit(1);

                if (!recentOtp) {
                    return res.status(404).json({
                        success: false,
                        message: "OTP not found",
                    });
                } else if (otp !== recentOtp.otp) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid OTP",
                    });
                }

                await Artist.create({
                    email,
                    password: hashedPassword,
                    mobileNumber: 99999255259,
                });

                message = "Artist created successfully";
                recentOtp.used = true;
                await recentOtp.save();
            } catch (error) {
                console.error("Error in artist signup:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while signing up artist",
                });
            }
        }

        return res.status(200).json({
            success: true,
            message,
        });
    } catch (error) {
        console.error("Error in signup function:", error);
        return res.status(500).json({
            success: false,
            message: "Unexpected server error",
        });
    }
};

module.exports = {
    sendOTP,
    signup,
};
