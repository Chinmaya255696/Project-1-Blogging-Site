const authorModel = require("../models/authorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body
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


module.exports.createAuthor = createAuthor






