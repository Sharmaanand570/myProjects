const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController")

router.post("/functionup/colleges", collegeController)

router.post("/functionup/interns", internController)

router.get("/functionup/collegeDetails", internController.getCollegeData)

module.exports = router;