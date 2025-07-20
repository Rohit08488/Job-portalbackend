const database = require("../Database/db");
const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');

// Get list of students
async function getStudentList(req, res) {
  try {
    const db = await database.main();
    const students = await db.collection("Studentdata").find().toArray();
    return res.json({ status: true, data: students });
  } catch (err) {
    console.error("Get Student List Error:", err);
    return res.status(500).json({ status: "error", message: "Internal error" });
  }
}

// Insert student data
async function insertStudentList(req, res) {
  try {
    const db = await database.main();
    const newStudent = req.body;

    // ✅ Step 1: Hash the password before saving
    if (!newStudent.password) {
      return res.status(400).json({ status: false, message: "Password is required" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newStudent.password, saltRounds);
    newStudent.password = hashedPassword;

    // ✅ Step 2: Handle file upload
    if (req.file) {
      newStudent.resume = req.file.path; // Make sure this is correct path format
    }

    // ✅ Step 3: Parse expertise if sent as JSON string
    if (typeof newStudent.expertise === "string") {
      newStudent.expertise = JSON.parse(newStudent.expertise);
    }

    const result = await db.collection("Studentdata").insertOne(newStudent);
    return res.json({ status: true, message: "Student inserted successfully" });

  } catch (err) {
    console.error("Insert Student Error:", err);
    return res.status(500).json({ status: "error", message: "Internal error" });
  }
}

// Update student data using email
// Update student data using email
async function updateStudentList(req, res) {
  try {
    console.log("Received data:", req.body);
    const { email, expertise, currentPassword, newPassword } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }

    const db = await database.main();
    const student = await db.collection("Studentdata").findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Student not found" });
    }

    // Handle expertise update
    if (expertise) {
      let expertiseArr = expertise;
      if (typeof expertise === "string") {
        try {
          expertiseArr = JSON.parse(expertise);
        } catch (err) {
          return res
            .status(400)
            .json({ status: false, message: "Invalid expertise format" });
        }
      }
      if (!Array.isArray(expertiseArr)) {
        return res
          .status(400)
          .json({ status: false, message: "Expertise must be an array" });
      }

      await db
        .collection("Studentdata")
        .updateOne({ email }, { $set: { expertise: expertiseArr } });
    }

    // Handle password change (plain text)
    if (currentPassword && newPassword) {
      if (student.password !== currentPassword) {
        return res
          .status(400)
          .json({ status: false, message: "Current password is incorrect" });
      }

      await db
        .collection("Studentdata")
        .updateOne({ email }, { $set: { password: newPassword } });
    }

    return res.json({ status: true, message: "Student data updated" });
  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
}

// Delete student by ID
async function deleteStudentList(req, res) {
  try {
    const db = await database.main();
    const { id } = req.params;

    const result = await db.collection("Studentdata").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Student not found" });
    }

    return res.json({ status: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete Student Error:", err);
    return res.status(500).json({ status: "error", message: "Internal error" });
  }
}
// Get student data by email
async function getStudentdataByEmail(req, res) {
  try {
    const db = await database.main();
    const { email } = req.body; // email from the request body

    const student = await db.collection("Studentdata").findOne({ email });

    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Student not found" });
    }

    return res.json({ status: true, data: student });
  } catch (err) {
    console.error("Get Student By Email Error:", err);
    return res.status(500).json({ status: "error", message: "Internal error" });
  }
}

module.exports = {
  getStudentList,
  insertStudentList,
  updateStudentList,
  deleteStudentList,
  getStudentdataByEmail,
};
