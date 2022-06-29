const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const validator = require("../validator/validator")

const createInterns = async function (req, res) {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(400).send({ status: false, message: "please enter some data" })
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
                const checkEmail = await internModel.findOne({ email: email })
                if (checkEmail) {
                    return res.status(400).send({ status: false, message: `This email: ${email} already in use` })
                }
                if (!(validator.isValidNumber(mobile) && validator.isValid(mobile))) {
                    return res.status(400).send({ status: false, message: "please provide your valid Number, size should be of 10 , e.g: 1234567890 " })
                }
                const checkMobile = await internModel.findOne({ mobile: mobile })
                if (checkMobile) {
                    return res.status(400).send({ status: false, message: `This number: ${number} already in use` })
                }
                if (!(validator.isValidCharacterLimit2to8(collegeName) && validator.isValid(collegeName))) {
                    return res.status(400).send({ status: false, message: "please provide your valid collegeName, e.g: iit" })
                }
                const checkCollege = await collegeModel.findOne({ name: collegeName })
                if (checkCollege) {
                    const createIntern = await internModel.create({ name: name, email: email, mobile: mobile, collegeId: checkCollege._id })
                    res.status(201).send({ status: true, data: createIntern })
                }
                else {
                    res.status(404).send({ status: false, message: "college is not present" })
                }
            }
            else {
                res.status(400).send({ status: false, message: "please enter valid data" })
            }
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createInterns = createInterns