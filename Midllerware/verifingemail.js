const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");
const database = require("../Database/db");
const otpStore = {}; // For production, use Redis or DB with expiry

// Send OTP for Student or Recruiter
const mailverfication = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  try {
    const db = await database.main();

    let collectionName;
    if (role === "student") {
      collectionName = "Studentdata";
    } else if (role === "recruiter") {
      collectionName = "Companydata";
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const existingUser = await db.collection(collectionName).findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification Code",
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP
const verifiedotp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  if (parseInt(otp) === otpStore[email]) {
    delete otpStore[email];
    return res.status(200).json({ verified: true });
  }

  res.status(400).json({ verified: false, message: "Invalid OTP" });
};

module.exports = { mailverfication, verifiedotp };
