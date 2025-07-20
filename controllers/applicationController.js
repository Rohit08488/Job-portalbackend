const nodemailer = require("nodemailer");
const path = require("path");
const database = require("../Database/db");

const applyToJob = async (req, res) => {
  try {
    const { studentId, jobId } = req.body;
    const db = await database.main();

    // Fetch student and job details
    const student = await db
      .collection("Studentdata")
      .findOne({ _id: studentId });
    const job = await db.collection("Jobpostingdata").findOne({ _id: jobId });

    if (!student || !job) {
      return res
        .status(404)
        .json({ status: false, message: "Student or Job not found" });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: student.email,
      to: job.email,
      subject: `Job Application: ${job.preference}`,
      text: `Dear Recruiter,\n\nI am interested in the ${job.preference} position. Please find my resume attached.\n\nBest regards,\n${student.fullName}`,
      attachments: [
        {
          filename: path.basename(student.resume),
          path: path.join(__dirname, "..", student.resume),
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.json({ status: true, message: "Application sent successfully" });
  } catch (error) {
    console.error("Error applying to job:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

module.exports = { applyToJob };
