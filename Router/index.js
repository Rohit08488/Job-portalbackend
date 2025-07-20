const express = require("express");
const router = express.Router();
const database = require("../Database/db");
const stnew = require("../controllers/student");
const cpnew = require("../controllers/company");
const acnew = require("../controllers/authController");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../Midllerware/verifyToken");
router.use(express.json());
const jpnew = require("../controllers/jobposting");
const applicationController = require("../controllers/applicationController");
const jspnew = require("../controllers/jobpostingforstudent");
const jcnew = require("../controllers/jobsController");
const emailnew = require("../controllers/emailsendtostudent");
const ajnew = require("../controllers/applyjob");
const vgnew = require("../Midllerware/verifingemail")

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Student API Routes
router.get("/getStudentdata", stnew.getStudentList);
router.post(
  "/insertStudentdata",
  upload.single("resume"),
  stnew.insertStudentList
);
router.put("/updateStudentdata",verifyToken, stnew.updateStudentList);
router.delete("/deleteStudentById/:id",verifyToken, stnew.deleteStudentList);
router.post("/getStudentByEmail", stnew.getStudentdataByEmail);

// Company API Routes
router.get("/getCompanydata", cpnew.getCompanyList);
router.post("/insertCompanydata", cpnew.insertCompanyList);
router.put("/updateCompanydata",verifyToken, cpnew.updateCompanyList);
router.delete("/deleteCompanyByName/:companyName",verifyToken, cpnew.deleteCompanylist);

// Auth Controller Routes
router.post("/authcontroller", acnew.signinstudent);
router.post("/authcontrollercompany", acnew.signincompany);
router.post("/authcontrolleradmin", acnew.signinadmin);
router.put("/authcontrolleradminupdate", acnew.updateAdminData);

// job posting api
router.get("/getjobpostingdata", jpnew.getJobList);
router.post("/insertjobpostingdata",verifyToken, jpnew.insertJobList);
router.delete("/deletejobpostingdata/:id",verifyToken, jpnew.deleteJobList);
router.get("/getjobpostingbyemail/:email", jpnew.getJobsByEmail);
router.get("/getjobforstudent", jpnew.getJobListForStudents);

// router.post("/applyToJob", applicationController.applyToJob);

router.get("/getjobpostingforstudent", jspnew.getstudentjobList);
router.post("/insertjobpostingforstudent",verifyToken, jspnew.insertstudentjobList);
router.get("/deletejobpostingforstudent",verifyToken, jspnew.deletestudentjoblist);
router.get("/getjobStudentdata/:email", jcnew.getjobliststudent);

router.post("/sendNotificationToCandidates",verifyToken, emailnew.sendingemailtostudent);
router.post("/sendingemailtocompany",verifyToken, ajnew.sendingEmailToCompany);



router.post("/sendOtp", vgnew.mailverfication)
router.post("/verifyOtp", vgnew.verifiedotp)
module.exports = router;
