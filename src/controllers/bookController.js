const mongoose = require("mongoose")
const userModel = require("../models/userModel")
const bookModel = require("../models/bookModel")
const validator = require("../validators/validator")
const moment = require("moment")

const createBook = async function (req, res) {
    try {
        const { title, excerpt, userId, ISBN, category, subcategory } = req.body
        const data = { title, excerpt, userId, ISBN, category, subcategory }
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter the data to create book" })
        }
        if ((title && excerpt && userId && ISBN && category && subcategory)) {
            if (!validator.isValid(title)) {
                return res.status(400).send({ status: false, message: "Please enter valid title" })
            }
            const findTitle = await bookModel.findOne({ title: title })
            if (findTitle) {
                return res.status(400).send({ status: false, message: `title ${title} is already present`})
            }
            if (!validator.isValid(excerpt)) {
                return res.status(400).send({ status: false, message: "Please enter valid excerpt" })
            }
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, message: "Please enter valid userId" })
            }
            const findUser = await userModel.findById(userId)
            if (!findUser) {
                return res.status(404).send({ status: false, message: "User not found" })
            }
            if (!validator.isValidISBN(ISBN)) {
                return res.status(400).send({ status: false, message: "Please enter valid ISBN Number, size should be of 13 e.g: 9781234567890" })
            }
            const findISBN = await bookModel.findOne({ ISBN: ISBN })
            if (findISBN) {
                return res.status(400).send({ status: false, message: `ISBN number ${ISBN} is already present` })
            }
            if (!validator.isValid(category)) {
                return res.status(400).send({ status: false, message: "Please enter valid category" })
            }
            if (!validator.isValidArray(subcategory)) {
                return res.status(400).send({ status: false, message: "Please enter valid subcategory in array (string) e.g:['subcategory1']" })
            }
            data["releasedAt"] = moment().format("YYYY-MM-DD")
            const createBook = await bookModel.create(data)
            return res.status(201).send({ status: true, message: 'Success', data: createBook })
        }
        else {
            return res.status(400).send({ status: false, message: "Please enter title, excerpt, userId, ISBN, category and subcategory to create book" })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//<<<<<<<<<<<<<<<<<<============================================GET BOOKS========================================>>>>>>>>>>>>>>>>>>>

const getBooks = async function (req,res){
    try{
        let bookDetails = req.query
        if(bookDetails){
            
        let returnBooks = await bookModel.find({bookDetails, isDelated:false})

        //let deletedBooks = await bookModel.find({bookDetails, isDeleted: true})

        //if (deletedBooks) return res.status(400).send({status: false, msg: "books deleted"})

        if(!returnBooks){
            return res.status(404).send({status: false, msg: " No book available show"})}
            else{
                 let books = {
                    _id: returnBooks._id,
                    title: returnBooks.title,
                    excerpt: returnBooks.userId,
                    category: returnBooks.category,
                    reviews: returnBooks.reviews,
                    releasedAt: returnBooks.releasedAt
                 }

                 returnBooks.books = books

                    res.status(200).send({status:true, message:'Books list', data: returnBooks})
                }
    }else{
    res.status(400).send({status: false, msg: "details required"})
    }

    }catch(err){
        res.status(500).send({status: fals, msg:err.message})
    }
}

module.exports ={ 
    createBook,
    getBooks
}
