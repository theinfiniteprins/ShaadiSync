const mongoose = require('mongoose');
const { mailSender } = require('../config/mailSender');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Use Date.now (without parentheses)
        expires: 300, // OTP expires after 5 minutes
    },
    used: {
        type: Boolean,
        default: false,
    },
});

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "OTP for Verification", `Your OTP is: ${otp}`);
        console.log("Email sent successfully:", mailResponse);
    } catch (error) {
        console.error("Error occurred while sending email:", error);
        throw new Error("Email sending failed"); // Throw error to stop further execution
    }
}

// Pre-save hook to send OTP verification email
OTPSchema.pre("save", async function (next) {
    try {
        await sendVerificationEmail(this.email, this.otp);
        next(); // Only call next() if email was sent successfully
    } catch (error) {
        next(error); // Pass the error to stop saving the document
    }
});

module.exports = mongoose.model("OTP", OTPSchema);