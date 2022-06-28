const blogModel = require("../models/blogModel")
const mongoose = require('mongoose');
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const isValidObjectId = function (objectId) { return mongoose.Types.ObjectId.isValid(objectId) }

const isValidArray = (value) => {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (value[i].trim().length === 0 || typeof (value[i]) !== "string") { return false }
        }
        return true
    } else { return false }
}

const objectValue = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const createBlog = async function (req, res) {
    try {
        let data2 = req.body.authorId
        let data = req.body


        if (!isValidObjectId(data.authorId)) {
            return res.status(400).send({ status: false, msg: "authorId is invalid!" })
        }

        let validAuthor = await authorModel.findById({ _id: data2 })
        if (!validAuthor) {
            return res.status(404).send({ status: false, msg: "authorId not found!" })
        }

        if (data.tags || data.tags === "") {
            if (!isValidArray(data.tags)) {
                return res.status(400).send({ status: false, msg: "tags are empty!" })
            }
        }

        if (data.subcategory || data.subcategory === "") {
            if (!isValidArray(data.subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory is empty!" })
            }
        }


        if (Object.keys(data).length != 0) {
            let savedData = await blogModel.create(data)
            return res.status(201).send({ msg: savedData })
        }
        else return res.status(400).send({ msg: "BAD REQUEST" })
    }
    catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}


const getAllBlogs = async function (req, res) {
    try {
        let { tags, category, authorId, subcategory } = req.query

<<<<<<< HEAD
        if (Object.keys(req.body).length === 0) return res.status(400).send({ status: false, msg: "please input something!" })
=======
        if (Object.keys(req.query).length === 0) return res.status(400).send({ status: false, msg: "please input something!" })
>>>>>>> 74f9b2704901ddc4e03b334b61d8daa14464d904

        if (tags === "") {
            if (!isValidArray(tags)) {
                return res.status(400).send({ status: false, msg: "tags are empty!" })
            }
        }

        if (authorId || authorId === "") {

            if (!isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, msg: "authorId is invalid!" })
            }
        }

        if (category === "") {
            if (!objectValue(category)) {
                res.status(400).send({ status: false, msg: "Please input category!" })
            }
        }

<<<<<<< HEAD
        if (!objectValue(category)) { res.status(400).send({ status: false, msg: "Please input category!" }) }

=======
>>>>>>> 74f9b2704901ddc4e03b334b61d8daa14464d904

        if (subcategory === "") {
            if (!isValidArray(subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory is empty!" })
            }
        }

        let blogsData = []

        let blogs = await blogModel.find({ $or: [{ authorId: authorId }, { tags: tags }, { category: category }, { subcategory: subcategory }] })


        blogs.filter(x => {
            if (x.isDeleted === false && x.isPublished === true)
                blogsData.push(x)
        })
        return res.status(200).send({ data: blogsData })
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}

const updateBlog = async function (req, res) {

    try {
        let { tags, body, title, subcategory } = req.body;

        let blogId = req.params.blogId

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: "blogId is invalid!" })
        }

        if (tags || tags === "") {
            if (!isValidArray(tags)) {
                return res.status(400).send({ status: false, msg: "tags are empty!" })
            }
        }
        if (subcategory || subcategory === "") {
            if (!isValidArray(subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory is empty!" })
            }
        }

        if (body || body === "") {
            if (!objectValue(body)) {
                return res.status(400).send({ status: false, msg: "body is empty!" })
            }
        }

        if (title || title === "") {
            if (!objectValue(title)) {
                return res.status(400).send({ status: false, msg: "title is empty!" })
            }
        }




        if (Object.keys(req.body).length === 0) { return res.status(400).send({ msg: "Please provide something to update!" }) }


        let blogvalid = await blogModel.findOne({ _id: blogId, isDeleted: false });

        if (!blogvalid) {
            return res.status(404).send({ status: false, msg: "BLOG NOT FOUND!" });
        }

        let uptoDateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { title, body, $addToSet: { subcategory: subcategory, tags: tags } }, { new: true });

        let updated = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isPublished: true, publishedAt: new Date() } }, { new: true })

        return res.status(200).send({ status: true, data: updated });


    } catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
};

const deleteById = async function (req, res) {
    try {
        let data = req.params.blogId
        if (!isValidObjectId(data)) return res.status(400).send({ status: false, msg: "blogId is invalid!" })

        let blogId = await blogModel.findOne({ _id: data, isDeleted: false })

        if (!blogId) {
            return res.status(404).send({ status: false, msg: "DATA NOT FOUND OR DATA ALREADY DELETED!" })
        }

        let savedData = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        return res.status(200).send()
    }
    catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }

}

const deleteBlogsByQuery = async function (req, res) {
    try {
        let { authorId, tags, subcategory, category, isPublished } = req.query

        if (isPublished || isPublished === "") {

            if (isPublished === "false") { isPublished = false }
            else return res.status(400).send({ status: false, msg: "isPublished should be false!" })
        }
        if (authorId || authorId === "") {

            if (!isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, msg: "authorId is invalid!" })
            }
        }

        let token = req.headers["x-api-key"];
        let authorToken = jwt.verify(token, "group19-project1");

        const findData = await blogModel.find({ $or: [{ authorId: authorId }, { tags: { $in: tags } }, { subcategory: { $in: subcategory } }, { category: category }, { isPublished: isPublished }], isDeleted: false, isPublished: false })

        if (Object.keys(findData).length == 0) return res.status(404).send({ status: false, msg: "no data to update!" })
        let allDeletedData = []
        for (i = 0; i < findData.length; i++) {
            if (authorToken.authorId == findData[i].authorId) {
                deletedData = await blogModel.findByIdAndUpdate({ _id: findData[i]._id }, { isDeleted: true, deletedAt: new Date() })
                allDeletedData.push(deletedData)
            }
        }


        if (allDeletedData.length === 0) {
            return res.status(404).send({ status: false, msg: "NO DATA TO UPDATE!" })
        }
        else res.status(200).send()

    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteById = deleteById
module.exports.deleteBlogsByQuery = deleteBlogsByQuery