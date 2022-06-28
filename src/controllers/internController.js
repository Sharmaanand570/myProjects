const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")

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

module.exports.getCollegeData = getCollegeData