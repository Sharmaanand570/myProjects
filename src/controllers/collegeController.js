const collegeModel = require("../models/collegeModel.js");
const internModel = require("../models/internModel.js");
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


 
const getCollegeData = async function (req, res){
   try{
       const collegeName = req.query.collegeName
       if(collegeName){
           const collegeData = await collegeModel.findOne({name:collegeName})
           if(!collegeData){
               return res.status(404).send({status:false, message:"college data not found"})
           }
           const internData = await internModel.find({collegeId:collegeData._id}).select({_id:1,name:1,email:1,mobile:1})
           if(Object.keys(internData).length==0){
               return res.status(404).send({status:false, message:"intern Data not found"})
           }
           const collegeDetail = {name:collegeData.name,fullName:collegeData.fullName,logoLink:collegeData.logoLink,intern:internData}
           res.status(200).send({status:true,data:collegeDetail})
       }
       else{
           res.status(400).send({status:false, message:"please input valid data"})
       }
   }
   catch(error){
       res.status(500).send({status:false, message:error.message})
   }
}

 module.exports.createCollege= createCollege
 module.exports.getCollegeData= getCollegeData


