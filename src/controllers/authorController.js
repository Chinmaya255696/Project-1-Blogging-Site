const authorModel = require("../models/authorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length != 0) {
            let savedData = await authorModel.create(data)
            res.status(201).send({status: true, data: savedData })
        }
        else res.status(400).send({status: false, data: "BAD REQUEST" })
    }
    catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
}


const getbookData = async function (req, res) {
    let allBooks = await bookModel.find()
    res.send({ msg: allBooks })
}

module.exports.createAuthor = createAuthor
module.exports.getbookData = getbookData





