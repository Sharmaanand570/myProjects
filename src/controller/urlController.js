const urlModel=require('../model/urlModel')
const validURL=require('valid-url')
const ShortUniqueId=require('short-unique-id')
const { find } = require('../model/urlModel')
const shortURL= new ShortUniqueId()

const createShortenURL = async function (req, res) {
    try{
        const baseUrl="http://localhost:3000/"
        
        const longUrl=req.body.longUrl
        if(Object.keys(req.body).length==0){
            return res.status(400).send({status:false, message:"body can not be empty"})
        }
        
        if(longUrl==""){
            return res.status(400).send({status:false, message:"Please provide link, it can not be empty"})
        }
        if(!longUrl){
            return res.status(400).send({status:false, message:`Please provide key name as 'longUrl'`})
        }
        if(Object.keys(req.body).length>1){
            return res.status(400).send({status:false, message:"you aren't allowed to provide another key except 'longUrl'"})
        }
        if(validURL.isUri(longUrl)){
            const findUrl=await urlModel.findOne({longUrl}).select({longUrl:1, shortUrl:1, urlCode:1, _id:0})
            if(findUrl){
                return res.status(200).send({status:true, data:findUrl})
            }
          const shortURLId = shortURL.stamp(10)
          const shortenUrl= baseUrl+shortURLId
          const createUrl=await urlModel.create({longUrl,shortUrl:shortenUrl,urlCode:shortURLId})
          const data={
            urlCode:createUrl.urlCode,
            longUrl:createUrl.longUrl,
            shortUrl:createUrl.shortUrl
          }
          return res.status(201).send({status:true, data})
        }else {
            return res.status(400).send({status:false, message:"invalid URL"})
        }
    }
    catch(error){ 
        return res.status(500).send({status:false, message:error.message, errorName:error.name})
    }
}



const getUrlByUrlCode= async function(req,res){
    try{
        const urlCode=req.params.urlCode
        const findUrl=await urlModel.findOne({urlCode:urlCode})
        const demo=findUrl.longUrl
        if(findUrl){
            return res.status(302).send("your link: "+ demo)
        }else {
            return res.status(404).send({status:false, message:"no url found"})
        }
    }catch(error){
       return res.status(500).send({status:false, message:error.message, errorName:error.name})
    }
}

module.exports={createShortenURL, getUrlByUrlCode}