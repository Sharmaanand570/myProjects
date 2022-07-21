const urlModel = require('../model/urlModel')
const validURL = require('valid-url')
const ShortUniqueId = require('short-unique-id')
const redis = require("redis")

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    14986,
    "redis-14986.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("Ixru7pOya8dSrkuZIHi1yu1Iv2Aw2Esb", function (err) {
    if (err) throw err;
});
redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



//=========================================== 1-Create Short URL Api =============================================//


const createShortenURL = async function (req, res) {
    try {
        const baseUrl = "http://localhost:3000/"

        const longUrl = req.body.longUrl
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "body can not be empty" })
        }

        if (longUrl == "") {
            return res.status(400).send({ status: false, message: "Please provide link, it can not be empty" })
        }
        if (!longUrl) {
            return res.status(400).send({ status: false, message: `Please provide key name as 'longUrl'` })
        }
        if (Object.keys(req.body).length > 1) {
            return res.status(400).send({ status: false, message: "you aren't allowed to provide another key except 'longUrl'" })
        }
        if (validURL.isWebUri(longUrl.toString())) {
            let cachedUrlData = await GET_ASYNC(`${longUrl}`)
            if (cachedUrlData) {
                return res.status(200).send({ status: true, message: "data coming from cache", data: JSON.parse(cachedUrlData) })
            }
            else {
                const findUrl = await urlModel.findOne({ longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })
                if (findUrl) {
                    await SET_ASYNC(`${longUrl}`, JSON.stringify(findUrl))
                    return res.status(200).send({ status: true, message: "first time data coming from db", data: findUrl })
                }
                else {
                    const shortURLId = new ShortUniqueId().stamp(10)
                    const shortenUrl = baseUrl + shortURLId
                    const createUrl = await urlModel.create({ longUrl, shortUrl: shortenUrl, urlCode: shortURLId })
                    const data = {
                        urlCode: createUrl.urlCode,
                        longUrl: createUrl.longUrl,
                        shortUrl: createUrl.shortUrl
                    }
                    await SET_ASYNC(`${longUrl}`, JSON.stringify(data))
                    return res.status(201).send({ status: true, data })
                }
            }
        } else {
            return res.status(400).send({ status: false, message: "invalid URL" })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message, errorName: error.name })
    }
}



//=========================================== 2-Get URL Api =============================================//


const getUrlByUrlCode = async function (req, res) {
    try {
        const urlCode = req.params.urlCode
        const cachedUrlData = await GET_ASYNC(`${urlCode}`)
        if (cachedUrlData) {
            return res.status(302).redirect(cachedUrlData)
        }
        else {
            const findUrlCode = await urlModel.findOne({ urlCode }).select({ longUrl: 1, _id: 0 })
            if (findUrlCode) {
                await SET_ASYNC(`${urlCode}`, findUrlCode.longUrl)
                return res.status(302).redirect(findUrlCode.longUrl)
            } else {
                return res.status(404).send({ status: false, message: "no url found" })
            }
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message, errorName: error.name })
    }
}

module.exports = { createShortenURL, getUrlByUrlCode }