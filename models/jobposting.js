const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema({
  companyName: String,
  post: String,
  preference: String, // example: "Web Development"
  email: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobPosting", jobPostingSchema);
