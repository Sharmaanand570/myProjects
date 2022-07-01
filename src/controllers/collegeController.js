const collegeModel = require("../models/collegeModel.js");
const internModel = require("../models/internModel.js");
const validator = require("../validator/validator.js");

//=========================================== 1-Create college Api ===============================================//

const createCollege = async function (req, res) {
    try {
        const { name, fullName, logoLink } = req.body;
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, message: "no content in the document, please provide college details" });
        }
        if (name && fullName && logoLink) {
            if (!(validator.isValidCharacterLimit2to8(name) && validator.isValid(name))) {
                return res.status(400).send({ status: false, message: "please provide your valid abbreviate college name, size of charctecr should be 2 to 8, e.g: iit or IIT" })
            }
            const checkCollege = await collegeModel.findOne({ name: name.trim().toUpperCase()})
            if (checkCollege) {
                return res.status(400).send({ status: false, message: `college ${name} is already present` })
            }
            if (!(validator.isValid(fullName) && validator.isValidCharacterLimit2to100(fullName))) {
                return res.status(400).send({ status: false, message: "please provide your valid college fullname, size of charctecr should be 2 to 100, e.g: Indian Institute of Technology or Indian Institute of Technology, Kanpur" })
            }
            if (!(validator.isValid(logoLink) && validator.isValidUrl(logoLink.toLowerCase()))) {
                return res.status(400).send({ status: false, message: "please provide a valid link e.g: https://www.example.com or https://example.com " })
            }
            const savedData = await collegeModel.create({name:name.trim().toUpperCase(), fullName:fullName.trim().toUpperCase(), logoLink:logoLink.trim().toLowerCase() });
            return res.status(201).send({ status: true, data: savedData })
        }
        else {
            return res.status(400).send({ status: false, message: "Invalid data, please provide college name,fullName and logoLink" })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//========================================= 1-Get college data Api ==============================================//

const getCollegeData = async function (req, res) {
    try {
        const collegeName = req.query.collegeName
        if (collegeName) {
            const collegeData = await collegeModel.findOne({ $or:[{name: collegeName.trim().toUpperCase(), isDeleted:false},{fullName:collegeName.trim().toUpperCase(), isDeleted:false}]})
            if (!collegeData) {
                return res.status(404).send({ status: false, message: `college name ${collegeName} is not found`})
            }
            let internData = await internModel.find({ collegeId: collegeData._id, isDeleted:false }).select({ _id: 1, name: 1, email: 1, mobile: 1 })
            if (Object.keys(internData).length == 0) {
                internData = "No any Intern had Applied"
            }
            const collegeDetail = { name: collegeData.name, fullName: collegeData.fullName, logoLink: collegeData.logoLink, interns: internData }
            return res.status(200).send({ status: true, data: collegeDetail })
        }
        else {
           return res.status(400).send({ status: false, message: "please enter collegeName" })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createCollege = createCollege
module.exports.getCollegeData = getCollegeData