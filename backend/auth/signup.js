const zod = require("zod");
const User = require("../models/User.model");
const otpGenerator = require("otp-generator")
const OTP = require("../models/Otp.model");
require("dotenv").config();

const Artist = require("../models/Artist.model");



const sendOTPBody = zod.object({
    email: zod.string().email(),
    role: zod.enum(["user", "artist"]),
})

const sendOTP = async (req, res) => {
    const { success } = sendOTPBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    var otpPayload = {};
    var message = "";
    const { email, role } = req.body;
    if (role === "user") {
        const existingUser = await User.findOne({
            email
        })

        if (existingUser) {
            return res.status(411).json({
                message: "Email not found"
            })
        }
        otpPayload = { email, otp, type: "user-signup" };
         message = "OTP sent successfully for user signup";
    }
    else {
        const existingUser = await Artist.findOne({
            email
        })

        if (existingUser) {
            return res.status(411).json({
                message: "Email not found"
            })
        }
        otpPayload = { email, otp, type: "artist-signup" };
         message = "OTP sent successfully for artist signup";
    }
    const otpBody = await OTP.create(otpPayload);

    res.status(200).json({
        success: true,
        message,
        otp,
    });

};

const signupBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    confirmPassword: zod.string(),
    otp: zod.string().length(6),
    role: zod.enum(["user", "artist"]),

})


const signup = async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const { email, password, confirmPassword, otp, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(411).json({
            message: "Both password should be same"
        })
    }
    var message = "";
    if (role === "user") {
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
            mobileNumber: 99999995259,
        });
        message = "User created successfully";
        recentOtp.used = true;
    await recentOtp.save();
    }
    else {
        const existingUser = await Artist.findOne({
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
        const newArtist = await Artist.create({
            email,
            password,
            name: "John Doe",
            mobileNumber: "1234567891",
            artistType: "64b2fa1aef1c2a45bcd9876e", // Replace with an actual ObjectId
            address: "123 Wedding Lane, Dream City",
            profilePic: "https://example.com/images/profilePic.jpg",
            description: "Experienced wedding photographer specializing in outdoor events.",
            certificates: [
                "https://example.com/certificates/certificate1.pdf",
                "https://example.com/certificates/certificate2.pdf"
            ],
            isBlocked: false,
            isVerified: true,
            balance: 2500
        });
        message = "Artist created successfully";
        recentOtp.used = true;
    await recentOtp.save();
    }
    

    res.status(200).json({
        success: true,
        message,
    });


};



module.exports = {
    sendOTP,
    signup,
};

