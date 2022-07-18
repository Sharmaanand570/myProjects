const express= require('express')
const router=express.Router()
const urlController=require('../controller/urlController')

router.post('/url/shorten', urlController.createShortenURL)
router.get('/:urlCode', urlController.getUrlByUrlCode)

module.exports=router