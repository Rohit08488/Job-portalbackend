const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const database = require("../Database/db");

const SECRET_KEY = process.env.JWT_SECRET; 

// ======== STUDENT LOGIN ========
async function signinstudent(req, res) {
  try {
    const db = await database.main();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password" });
    }

    const user = await db.collection("Studentdata").findOne({ email });

    if (!user) return res.json({ status: false, message: "No user found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ status: false, message: "Wrong password" });

    const token = jwt.sign({ email: user.email, role: "student" }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ status: true, token, message: "Login successful" });

  } catch (err) {
    console.error("Student Login Error:", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

// ======== COMPANY LOGIN ========
async function signincompany(req, res) {
  try {
    const db = await database.main();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password" });
    }

    const user = await db.collection("Companydata").findOne({ email });

    if (!user) return res.json({ status: false, message: "No user found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ status: false, message: "Wrong password" });

    const token = jwt.sign({ email: user.email, role: "recruiter" }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ status: true, token, message: "Login successful" });

  } catch (err) {
    console.error("Recruiter Login Error:", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

// ======== ADMIN LOGIN ========
async function signinadmin(req, res) {
  try {
    const db = await database.main();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password" });
    }

    const user = await db.collection("admindata").findOne({ email });

    if (!user) return res.json({ status: false, message: "No user found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ status: false, message: "Wrong password" });

    const token = jwt.sign({ email: user.email, role: "admin" }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ status: true, token, message: "Login successful" });

  } catch (err) {
    console.error("Admin Login Error:", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

// ======== ADMIN PASSWORD UPDATE (ONLY FOR 'rohit@gmail.com') ========
async function updateAdminData(req, res) {
  try {
    const db = await database.main();
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ status: "fail", message: "Please provide email and new password" });
    }

    if (email !== "rohit@gmail.com") {
      return res.status(403).json({ status: "fail", message: "Unauthorized access! Only 'rohit@gmail.com' is allowed to update the password." });
    }

    const admin = await db.collection("admindata").findOne({ email });
    if (!admin) {
      return res.status(404).json({ status: "fail", message: "No admin found with the provided email" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await db.collection("admindata").updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (updated.matchedCount === 0) {
      return res.status(400).json({ status: "fail", message: "Error updating the password" });
    }

    return res.json({ status: "success", message: "Password updated successfully" });

  } catch (err) {
    console.error("Error updating admin password:", err);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

module.exports = {
  signinstudent,
  signincompany,
  signinadmin,
  updateAdminData,
};
