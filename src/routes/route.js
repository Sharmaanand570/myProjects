const express = require('express')
const router = express.Router()
const urlController = require('../controller/urlController')
<<<<<<< HEAD

//-----------------------------------------------------------------------------------//
=======
>>>>>>> f2399d0142401229f6b5260056ed065601db5f1e

router.post('/url/shorten', urlController.createShortenURL)
router.get('/:urlCode', urlController.getUrlByUrlCode)

<<<<<<< HEAD
router.all("/**", function (req, res) {
    res.status(404).send({ status: false, message: "The api you request is not available" })
})

//-----------------------------------------------------------------------------------//

module.exports = router

//-----------------------------------------------------------------------------------//
=======
router.all('/**', function (req, res) {
    res.status(400).send({ status: false, messsage: "invalid http request" })
})

module.exports = router
>>>>>>> f2399d0142401229f6b5260056ed065601db5f1e
