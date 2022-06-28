const e = require("express")
const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel")


const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let duplicateEmail = await authorModel.findOne({ email:data.email});
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg:`${data.email} already exists!` });
        }
      
        if (Object.keys(data).length != 0) {
            let savedData = await authorModel.create(data)
            return res.status(201).send({ status: true, data: savedData })
        }
        else return res.status(400).send({ status: false, msg: "BAD REQUEST" })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const loginAuthor = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
      
        if (!email && !password) return res.status(400).send({ status: false, msg: "BAD REQUEST!" })

        let author = await authorModel.findOne({ email: email, password: password })
        if (!author) { return res.status(404).send({ status: false, msg: "email or the password is not correct" }) }

        let token = jwt.sign(
            {
                authorId: author._id.toString(),
                group: "ninteen",
                project: "BlogMiniSite",
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 10*60*60
            },
            "group19-project1"
        )
        return res.status(201).send({ status: true, data: token })
    }
    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor










