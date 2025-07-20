const database = require("../Database/db");
const { ObjectId } = require("mongodb");

const getJobList = async (req, res) => {
  const db = database.main();
  const collection = (await db).collection("Jobposting");
  const findResult = await collection.find({}).toArray();
  try {
    res.send({
      status: 200,
      message: findResult,
    });
  } catch (arr) {
    res.send({
      message: "something went worng" + arr,
      status: 500,
    });
  }
};

const insertJobList = async (req, res) => {
  try {
    const db = database.main();
    const collection = (await db).collection("Jobposting");
    let result = await collection.insertOne(req.body);
    console.log(result);
    res.send({
      status: 200,
      message: "data inserted  successfully",
      data: result,
    });
  } catch (arr) {
    res.send({
      message: "something went worng " + arr,
      status: 500,
    });
  }
};

async function deleteJobList(req, res) {
  try {
    const db = await database.main();
    const { id } = req.params;

    console.log("Received id:", id); // Debugging log

    const objectId = new ObjectId(id);
    const job = await db.collection("Jobposting").findOne({ _id: objectId });

    if (!job) {
      console.log("Job not found with id:", id); // Log if job is not found
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    const result = await db
      .collection("Jobposting")
      .deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      console.log("Delete operation did not affect any documents");
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    console.log("Job deleted successfully:", job); // Log successful deletion
    return res.json({ status: true, message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete Job Error:", err); // Log the exact error
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: err.message,
    });
  }
}

const getJobsByEmail = async (req, res) => {
  try {
    const db = database.main();
    const collection = (await db).collection("Jobposting");
    const recruiterEmail = req.params.email;

    const jobs = await collection.find({ email: recruiterEmail }).toArray();

    res.send({
      status: 200,
      message: jobs,
    });
  } catch (err) {
    console.error("Error fetching recruiter jobs:", err);
    res.send({
      status: 500,
      message: "Something went wrong",
    });
  }
};

const getJobListForStudents = async (req, res) => {
  try {
    const db = database.main();
    const collection = (await db).collection("Jobposting");

    // Get expertise from the query parameter
    const expertise = req.query.expertise; // Expertise is passed as a query parameter (array)

    // If expertise is not provided, return an error
    if (!expertise || expertise.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No expertise provided for filtering jobs.",
      });
    }

    // Find job postings where the 'preference' does not match any of the student's expertise
    const jobs = await collection
      .find({
        preference: { $nin: expertise }, // Exclude the expertise from job preferences
      })
      .toArray();

    res.send({
      status: 200,
      message: jobs,
    });
  } catch (err) {
    console.error("Error fetching student jobs:", err);
    res.status(500).send({
      status: 500,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getJobList,
  insertJobList,
  deleteJobList,
  getJobsByEmail,
  getJobListForStudents,
};
