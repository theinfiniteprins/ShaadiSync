const zod = require("zod");
const User = require("../models/User.model");
const UserTransactionHistory = require("../models/UserTransactionHistory.model");
const otpGenerator = require("otp-generator");
const OTP = require("../models/Otp.model");
require("dotenv").config();
const Artist = require("../models/Artist.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getCoordinatesFromNominatim} = require("../controllers/Artist.controller");

const sendOTPBody = zod.object({
    email: zod.string().email(),
    role: zod.enum(["user", "artist"]),
});

const generateAvatarUrl = (email) => {
    const name = email.split('@')[0];
    const formattedName = name
        .replace(/[^a-zA-Z0-9]/g, '+')
        .replace(/\+{2,}/g, '+')
        .trim();
    return `https://ui-avatars.com/api/?name=${formattedName}&background=0D8ABC&color=fff`;
};

const getRandomCoordinates = () => {
  // Random coordinates within India's bounds
  const indiaCoordinates = {
    minLat: 8.4,
    maxLat: 37.6,
    minLng: 68.7,
    maxLng: 97.25,
  };

  const randomLat = Math.random() * (indiaCoordinates.maxLat - indiaCoordinates.minLat) + indiaCoordinates.minLat;
  const randomLng = Math.random() * (indiaCoordinates.maxLng - indiaCoordinates.minLng) + indiaCoordinates.minLng;

  return [randomLng, randomLat]; // GeoJSON format is [longitude, latitude]
};

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

        const { email, password,mobileNumber, confirmPassword, otp, role } = req.body;

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
                    mobileNumber: mobileNumber,
                    SyncCoin: SyncCoin,
                    profilePic: generateAvatarUrl(email),
                });
                
                await UserTransactionHistory.create({
                    userId: newUser._id,
                    amount: 10,
                    syncCoin: SyncCoin,
                    transactionType: "credit",  
                    description: "Initial SyncCoins added on signup", 
                    unlockId: null,
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
            return res.status(200).json({
                success: true,
                message,
            });
        }else if (role === "artist") {
            try {
                const { email, otp, password, confirmPassword } = req.body;
        
                if (password !== confirmPassword) {
                    return res.status(400).json({ success: false, message: "Passwords do not match" });
                }
        
                const existingArtist = await Artist.findOne({ email });
                if (existingArtist) {
                    return res.status(400).json({ success: false, message: "Email already registered" });
                }
        
                const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
                if (!recentOtp || otp !== recentOtp.otp) {
                    return res.status(400).json({ success: false, message: "Invalid OTP" });
                }
        
                // OTP is valid, mark it as used
                recentOtp.used = true;
                await recentOtp.save();
                const hashedPassword = await bcrypt.hash(password, 10);
        
                const token = jwt.sign({ email, password:hashedPassword }, process.env.JWT_SECRET, { expiresIn: "15m" });
        
                return res.status(200).json({
                    success: true,
                    message: "Email verified. Now fill the complete profile.",
                    token, 
                });
            } catch (error) {
                console.error("Error verifying artist email:", error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        }
    } catch (error) {
        console.error("Error in signup function:", error);
        return res.status(500).json({
            success: false,
            message: "Unexpected server error",
        });
    }
};

const createArtistProfile = async (req, res) => {
    try {
        const { email, password } = req.artistData;
        const { name, mobile, artistType, address } = req.body;

        // Create base artist data
        const artistData = {
            email,
            password,
            name,
            mobileNumber: mobile,
            artistType,
            address,
            profilePic: generateAvatarUrl(name),
            description: "",
            isBlocked: false,
            isVerified: false,
            balance: 0,
            maxCharge: 0
        };

        // Get location coordinates or use default
        const locationData = await getCoordinatesFromNominatim(address);
        
        // Set coordinates - either from location data or random default
        artistData.coordinates = {
            type: 'Point',
            coordinates: locationData?.coordinates || getRandomCoordinates()
        };

        // Create artist
        const newArtist = await Artist.create(artistData);

        return res.status(200).json({ 
            success: true, 
            message: "Artist profile created successfully",
            artistId: newArtist._id
        });

    } catch (error) {
        console.error("Error creating artist profile:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to create artist profile",
            error: error.message 
        });
    }
};


module.exports = {
    sendOTP,
    signup,
    createArtistProfile,
};
