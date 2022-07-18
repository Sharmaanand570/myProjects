const express= require('express')
const router=express.Router()
const urlController=require('../controller/urlController')

router.post('/url/shorten', urlController.createShortenURL)
router.get('/:urlCode', urlController.getUrlByUrlCode)

router.all('/**', function(req, res){
    res.status(400).send({status: false, messsage:"invalid http request"})
})

module.exports=router
