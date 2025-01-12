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
    type: {
        type: String,
        enum: ["user-signup","artist-signup", "forgot-password","verification"], 
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

async function sendVerificationEmail(email, otp, type) {
  let htmlBody = "";
  let subject = "";

  switch (type) {
    case "artist-signup":
      subject = "Welcome to ShaadiSync - Artist Signup OTP";
      htmlBody = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #4CAF50;">ShaadiSync - Artist Signup</h1>
          <p>Thank you for signing up as an artist with ShaadiSync! We're thrilled to have you onboard to help create memorable weddings.</p>
          <p>Your OTP for artist signup verification is:</p>
          <h2 style="background-color: #f9f9f9; padding: 10px; display: inline-block; border-radius: 5px; color: #4CAF50;">${otp}</h2>
          <p>Please use this OTP within the next 5 minutes to complete your signup process.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
        </div>
      `;
      break;

    case "user-signup":
      subject = "Welcome to ShaadiSync - User Signup OTP";
      htmlBody = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #4CAF50;">ShaadiSync - User Signup</h1>
          <p>Thank you for signing up with ShaadiSync! We look forward to helping you plan your dream wedding.</p>
          <p>Your OTP for user signup verification is:</p>
          <h2 style="background-color: #f9f9f9; padding: 10px; display: inline-block; border-radius: 5px; color: #4CAF50;">${otp}</h2>
          <p>Please use this OTP within the next 5 minutes to complete your signup process.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
        </div>
      `;
      break;

    case "forgot-password":
      subject = "ShaadiSync - OTP for Password Reset";
      htmlBody = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #FF5722;">ShaadiSync - Password Reset Request</h1>
          <p>We received a request to reset your password for your ShaadiSync account.</p>
          <p>Your OTP for password reset is:</p>
          <h2 style="background-color: #f9f9f9; padding: 10px; display: inline-block; border-radius: 5px; color: #FF5722;">${otp}</h2>
          <p>If you did not request this, please ignore this email.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">For security reasons, please do not share this OTP with anyone.</p>
        </div>
      `;
      break;

    case "verification":
    default:
      subject = "ShaadiSync - OTP for Verification";
      htmlBody = `
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
  }

  try {
    const mailResponse = await mailSender(
      email,
      subject,
      `Your OTP is: ${otp}`, // Fallback text
      htmlBody
    );
    console.log("Email sent successfully:");
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw new Error("Email sending failed"); // Throw error to stop further execution
  }
}

// Pre-save hook to send OTP verification email
OTPSchema.pre("save", async function (next) {
    try {
        await sendVerificationEmail(this.email, this.otp, this.type);
        next(); // Only call next() if email was sent successfully
    } catch (error) {
        next(error); // Pass the error to stop saving the document
    }
});

module.exports = mongoose.model("OTP", OTPSchema);