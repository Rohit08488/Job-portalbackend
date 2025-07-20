const nodemailer = require("nodemailer");
const { main } = require("../Database/db"); // Import the main function to get the db connection
const path = require("path");
// Nodemailer transport setup (using Gmail here as an example)
const sendingemailtocompany = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail password or app password (if 2FA enabled)
  },
});

// Backend logic to send email to company
const sendingEmailToCompany = async (req, res) => {
  const { jobTitle, companyName, companyEmail, studentId } = req.body;
  console.log("fcgvhb:", { jobTitle, companyName, companyEmail, studentId });

  try {
    // Step 1: Get the database connection
    const db = await main();

    // Step 2: Query the student collection to get expertise and student details
    const student = await db
      .collection("Studentdata")
      .findOne({ email: studentId });

    if (!student) {
      return res.status(404).send({ message: "Student not found." });
    }

    // Step 3: Query the jobs collection to get job details (assuming job collection exists)
    const job = await db
      .collection("Jobposting")
      .findOne({ preference: jobTitle, companyName });

    if (!job) {
      return res.status(404).send({ message: "Job not found." });
    }
    const resumePath = `${student.resume}`;
    // Step 4: Compose the email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email (your email)
      to: companyEmail, // The company's email address
      subject: `Job Application: ${jobTitle} by ${student.email}`,
      text: `Hello ${companyName},\n\nStudent with email ${student.email} has applied for the job: "${jobTitle}".\n\nYou can contact them at ${student.email} to further discuss the job.\n\nBest regards,\nJob Portal`,
      attachments: [
        {
          filename: "Resume_" + student.name + path.extname(student.resume), // Optional: cleaner name
          path: resumePath,
        },
      ],
    };

    // Step 5: Send the email
    await sendingemailtocompany.sendMail(mailOptions);

    // Step 6: Send a response indicating success
    res
      .status(200)
      .send({ message: "Application sent successfully to the company!" });
  } catch (error) {
    console.error("Error sending application email:", error);
    res.status(500).send({ message: "Failed to send the application email." });
  }
};

module.exports = { sendingEmailToCompany };
