const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const validator = require("../validator/validator")

//========================================= 1-Create interns Api ================================================//

const createInterns = async function (req, res) {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, message: "no content in the document, please provide intern details" })
        }
        else {
            const { name, email, mobile, collegeName } = req.body
            if (name && email && mobile && collegeName) {
                if (!(validator.isValidCharacterLimit2to100(name) && validator.isValid(name))) {
                    return res.status(400).send({ status: false, message: "please provide your valid name, e.g: Name Surname" })
                }
                if (!(validator.isValidEmail(email) && validator.isValid(email))) {
                    return res.status(400).send({ status: false, message: "please provide your valid email, e.g: example@example.example" })
                }
                const checkEmail = await internModel.findOne({ email: email.trim().toLowerCase() })
                if (checkEmail) {
                    return res.status(400).send({ status: false, message: `This email: ${email.trim()} is already in used for intern`})
                }
                if (!(validator.isValidNumber(mobile) && validator.isValid(mobile))) {
                    return res.status(400).send({ status: false, message: "please provide your valid Number, size should be of 10 , e.g: +91 1234567890 " })
                }
                const checkMobile = await internModel.findOne({ mobile: mobile.trim()})
                if (checkMobile) {
                    return res.status(400).send({ status: false, message: `This number: ${mobile.trim()} is already in used for intern` })
                }
                if (!(validator.isValidCharacterLimit2to8(collegeName) && validator.isValid(collegeName))) {
                    return res.status(400).send({ status: false, message: "please provide your valid collegeName, e.g: iit or IIT" })
                }
                const checkCollege = await collegeModel.findOne({ name: collegeName.trim().toUpperCase()})
                if (checkCollege) {
                    const createIntern = await internModel.create({ name: name.trim(), email: email.trim().toLowerCase(), mobile: mobile.trim(), collegeId: checkCollege._id })
                    return res.status(201).send({ status: true, data: createIntern })
                }
                else {
                    return res.status(404).send({ status: false, message: "college is not present" })
                }
            }
            else {
                return res.status(400).send({ status: false, message: "please enter name, email, mobile and collegeName" })
            }
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createInterns = createInterns