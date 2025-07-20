// controllers/jobposting.js
const database = require("../Database/db"); // Assuming this is where you're connecting to MongoDB

const getjobliststudent = async (req, res) => {
  const { email } = req.params;

  try {
    const db = await database.main();

    const student = await db.collection("Studentdata").findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Convert expertise if it's a string (e.g., from `"["A","B"]"` to array)
    let expertise = student.expertise;
    if (typeof expertise === "string") {
      try {
        expertise = JSON.parse(expertise);
      } catch (e) {
        return res.status(400).json({ message: "Invalid expertise format" });
      }
    }

    const jobs = await db
      .collection("Jobposting")
      .find({
        preference: { $in: expertise },
      })
      .toArray();

    res.status(200).json({
      student: { ...student, expertise }, // Return parsed expertise
      jobs,
    });
  } catch (err) {
    console.error("Error fetching jobs for student:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getjobliststudent,
};
