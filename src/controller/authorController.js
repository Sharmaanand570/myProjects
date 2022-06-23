const authorModel = require("../models/authorModel.js")

const createAuthor = async function (req, res) {
    try {

        let authorData = req.body;

        const { fname, lname, title, email, password } = authorData;
         
        if (!(fname && lname && title && email && password)) {
            return res.status(400).send({ status: false, msg: "key value is not present" })
        }
    
        let checkMail = await authorModel.findOne({ email: email });
        if (checkMail) {
            return res.status(400).send({ status: false, msg: " duplicate email" })
        }
        if ((title !== "Mr") && (title !== "Mrs") && (title !== "Miss")) {
            res.status(400).send({ status: false, msg: "please enter correct title eg Mr,Mrs,Miss" })
        }

        if (typeof (fname) === "string" &&  fname.trim().length !== 0) {
            if (typeof (lname) === "string"  &&  lname.trim().length !== 0) {
                if (typeof (email) === "string"  &&  email.trim().length !== 0) {
                    if (typeof (password) === "string"  &&  password.trim().length !== 0) {
                        let savedAuthorData = await authorModel.create(authorData);
                        if (!savedAuthorData) {
                            res.status(400).send({ status: false, msg: "cannot create data" })
                        }
                        res.status(201).send({ status: true, data: savedAuthorData });
                    } else { res.status(400).send({ status: false, data: "password is invalid" }) }
                } else { res.status(400).send({ status: false, data: "email is invalid" }) }
            } else { res.status(400).send({ status: false, data: "lname is invalid" }) }
        } else { res.status(400).send({ status: false, data: "fname is invalid" }) }

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

const authorLogin = async function(req, res){

}

module.exports.authorLogin = authorLogin
module.exports.createAuthor = createAuthor
