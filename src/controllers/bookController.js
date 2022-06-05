const bookModel = require("../models/bookModel")

const createbookData = async function (req,res) {
    let data = req.body
    let savedData = await bookModel.create(data)
    res.send({msg: savedData})
}

const getbookData = async function (req,res) {
    let allBooks = await bookModel.find()  
    res.send({msg: allBooks})
}

module.exports.createbookData = createbookData
module.exports.getbookData = getbookData