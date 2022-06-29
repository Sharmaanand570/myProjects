const collegeModel = require("../models/collegeModel.js");
const validator = require("../validator/validator.js");


const createCollege = async function (req, res) {
    try {
       const data = {name, fullName, logoLink} = req.body;
       if (Object.keys(data).length === 0) {
          return res.status(400).send({ status: false, msg: "no content in the document" });
       }
       if(!validator.isValid(name))
       {returnres.status(400).send({status: false, message:"please provide your valid college name"})}
       
       if(!validator.isValid(fullName))
       {return res.status(400).send({status: false, message:"please provide your valid college fullname"})}

       if(!validator.isValid(logoLink))
       {return res.status(400).send({status: false, message:"please provide a valid link"})}
       
       const savedData = await collegeModel.create(data);
       res.status(201).send({ status: true, data: savedData })
    } catch (error) {
       console.log(error)
       return res.status(500).send({ status: false, errorName: error.name, msg: error.message });
    }
 }

 module.exports.createCollege= createCollege


