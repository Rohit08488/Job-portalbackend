const express = require("express");
const nodemailer = require("nodemailer");
const { main } = require("../Database/db"); // your DB connection file

const sendingemailtostudent = async (req, res) => {
  const { jobTitle, companyName, preference } = req.body;

  try {
    // Connect to DB
    const db = await main();
    const studentCollection = db.collection("Studentdata"); // Update collection name if needed

    // 1. Get all students
    const allStudents = await studentCollection.find().toArray();

    // 2. Filter students based on expertise matching the job preference
    const matchedStudents = allStudents.filter(
      (student) => student.expertise && student.expertise.includes(preference)
    );

    // If no students matched, return an error message
    if (matchedStudents.length === 0) {
      return res
        .status(200)
        .json({ message: "No students matched the job preference." });
    }

    // 3. Setup nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password
      },
    });

    // 4. Send emails to each matched student
    for (const student of matchedStudents) {
      const mailOptions = {
        from: `"Resume Portal" <${process.env.EMAIL_USER}>`, // Replace with your email
        to: student.email, // Student's email
        subject: `New Job Alert: ${jobTitle} at ${companyName}`,
        text: `Hello ${
          student.name || "Student"
        },\n\nA new job matching your expertise has been posted on Resume Portal.\n\nPlease check your Resume Portal account for more details.\n\nRegards,\nResume Portal Team`,
      };

      try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${student.email}`);
      } catch (error) {
        console.error(`Error sending email to ${student.email}:`, error);
      }
    }

    // Send success response
    res.status(200).json({
      message: `Emails sent to ${matchedStudents.length} students.`,
    });
  } catch (error) {
    console.error("Error notifying students:", error);
    res.status(500).json({ error: "Failed to notify students." });
  }
};

module.exports = { sendingemailtostudent };
