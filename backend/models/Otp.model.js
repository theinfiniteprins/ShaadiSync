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
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #4CAF50;">ShaadiSync - OTP Verification</h1>
        <p>Welcome to ShaadiSync! We connect you with the best wedding planning services to make your special day unforgettable.</p>
        <p>Your OTP for verification is:</p>
        <h2 style="background-color: #f9f9f9; padding: 10px; display: inline-block; border-radius: 5px; color: #4CAF50;">${otp}</h2>
        <p>Please use this OTP within the next 5 minutes to complete your verification process.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">If you did not request this OTP, please ignore this email.</p>
      </div>
    `;
  
    try {
      const mailResponse = await mailSender(
        email,
        "OTP for Verification",
        `Your OTP is: ${otp}`, // Fallback text
        htmlBody
      );
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