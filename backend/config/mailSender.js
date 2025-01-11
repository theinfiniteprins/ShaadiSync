const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com", // Defaulting to Gmail SMTP host
  port: parseInt(process.env.EMAIL_PORT, 10) || 587, // Ensure port is a number
  secure: process.env.EMAIL_PORT == '465', // Use secure if port is 465 (SSL)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.mailSender = async (email, title, body, htmlBody) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: title,
    text: body, // Fallback plain text
    html: htmlBody, // Enhanced HTML content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error.message || error.response);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
