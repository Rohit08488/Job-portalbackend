const database = require("../Database/db");

const getstudentjobList = async (req, res) => {
  const db = database.main();
  const collection = (await db).collection("studentjob");
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

const insertstudentjobList = async (req, res) => {
  try {
    const db = database.main();
    const collection = (await db).collection("studentjob");
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

const deletestudentjoblist = async (req, res) => {
  try {
    const db = database.main();
    const collection = (await db).collection("studentjob");
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
  getstudentjobList,
  insertstudentjobList,
  deletestudentjoblist,
};
