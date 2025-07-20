const database = require("../Database/db");
const bcrypt = require('bcrypt');

const getCompanyList = async (req, res) => {
  const db = database.main();
  const collection = (await db).collection("Companydata");
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

const insertCompanyList = async (req, res) => {
  try {
    const db = database.main();
    const collection = (await db).collection("Companydata");

    const newCompany = req.body;

    // ✅ Check if password exists
    if (!newCompany.password) {
      return res.status(400).send({
        status: 400,
        message: "Password is required",
      });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(newCompany.password, 10);
    newCompany.password = hashedPassword;

    // ✅ Insert into DB
    const result = await collection.insertOne(newCompany);

    res.send({
      status: 200,
      message: "Company data inserted successfully",
      data: result,
    });
  } catch (err) {
    console.error("Insert Company Error:", err);
    res.status(500).send({
      status: 500,
      message: "Something went wrong: " + err.message,
    });
  }
};

const updateCompanyList = async (req, res) => {
  try {
    const db = database.main();
    const collection = (await db).collection("Companydata");
    var newvalues = { $set: req.body };
    let result = await collection.updateOne(
      { name: req.query.name },
      newvalues
    );
    console.log(result);
    if (result.modifiedCount > 0) {
      res.send({
        status: 200,
        message: "data updated  successfully",
        data: result,
      });
    } else {
      res.send({
        message: "please enter the coorect name",
      });
    }
  } catch (arr) {
    res.send({
      message: "something went worng " + arr,
      status: 500,
    });
  }
};

const deleteCompanylist = async (req, res) => {
  try {
    const db = database.main();
    const collection = (await db).collection("Companydata");
    let result = await collection.deleteOne({
      companyName: req.params.companyName,
    });
    console.log(result);
    if (result.deletedCount > 0) {
      res.send({
        status: 200,
        message: "data deleted  successfully",
        data: result,
      });
    } else {
      res.send({
        message: "please enter the coorect name",
      });
    }
  } catch (arr) {
    res.send({
      message: "something went worng " + arr,
      status: 500,
    });
  }
};
module.exports = {
  getCompanyList,
  insertCompanyList,
  updateCompanyList,
  deleteCompanylist,
};
