const e = require("express")
const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (!data.title.enum) return res.status(404).send({ status: false, msg: "Title is missing or mismatched!" })
        if (Object.keys(data).length != 0) {
            let savedData = await authorModel.create(data)
            return res.status(201).send({ status: true, data: savedData })
        }
        else return res.status(400).send({ status: false, msg: "BAD REQUEST" })
    }
    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const loginAuthor = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
        //    if (email === 0 && password === 0) return res.status(400).send({ status: false, msg: "Both email and password is required!" })
        if (!email && !password) return res.status(404).send({ status: false, msg: "DATA NOT FOUND!" })

        let author = await authorModel.findOne({ email: email, passwrod: password })
        if (!author) { return res.status(400).send({ status: false, msg: "email or the password is not correct" }) }

        let token = jwt.sign(
            {
                authorId: author._id.toString(),
                group: "ninteen",
                project: "BlogMiniSite",
            },
            "group19-project1"
        )
        res.status(201).send({ status: true, data: token })
    }
    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor










