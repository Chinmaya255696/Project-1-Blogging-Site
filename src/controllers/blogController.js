const blogModel = require("../models/blogModel")
const mongoose = require('mongoose');
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
// const { findById, findByIdAndUpdate } = require("../models/blogModel");
const isValidObjectId = function (objectId) { return mongoose.Types.ObjectId.isValid(objectId) }

// const isValidkey = (value) => {
//     if (typeof value === "string" && value.trim().length === 0) return false;
//     if (typeof value === "string") { return true }
//     else {
//         return false
//     }
// }

const isValidArray = (value) => {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (value[i].trim().length === 0 || typeof (value[i]) !== "string") { return false }
        }
        return true
    } else { return false }
}

// const objectValue = function (value) {
//     if (typeof value === "undefined" || value === null) return false
//     if (typeof value === "string" && trim().length === 0) return false
//     return true
// }

const createBlog = async function (req, res) {
    try {
        let data2 = req.body.authorId
        let data = req.body


        // if (!data.authorId) {
        //     return res.status(404).send({ status: false, msg: "authorId is required!" })
        // }
        // if (data.authorId || data.authorId === "") {

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

        // else if (!objectValue(data.tags)) {
        //     return res.status(404).send({ status: false, msg: "tags are empty!" })
        // }
        // if (Object.keys(data.category).length === 0) {
        //     return res.status(404).send({ status: false, msg: "category is required!" })
        // }
        // else if (!objectValue(data.category)) {
        //     return res.status(404).send({ status: false, msg: "category is empty!" })
        // }
        // else if (!objectValue(data.subcategory)) {
        //     return res.status(404).send({ status: false, msg: "subcategory is empty!" })
        // }

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


//<=======why the express validator is not reading the data stored in array of strings...to be precise it is only returning one input i.e ignoring the other inputs....?================================>//

//<==========================how to change the error status code coming from the validator/express validator..?=========================>

//<==============our password is not unique but still it is shwoing duplicate key validation with a server error...?===================>

//<=============what should be the status code if from schema a single key's value is empty ?============================>

//<==============how to validate if a key is present but its value is empty....? =======================================>

//<====when we are inputing invalid key name in query params, code fat jata hai aur error catch mein store nhi hota hai..how to resolve..?==>


const getAllBlogs = async function (req, res) {
    try {
        let tags = req.query.tags

        if (tags === "") {
            if (!isValidArray(tags)) {
                return res.status(400).send({ status: false, msg: "tags are empty!" })
            }
        }
        // if ( Object.keys(tags.tags).length === 0) { return res.status(404).send({ status: false, msg: "tags are empty!" }) }

        //<==========when we are trying fetch data without tags...its showing error?==========================================>//  
        //<======================why .length is making the presence of the key's value compulsory ?========================================>//

        let authorId = req.query.authorId

        if (!authorId) { res.status(400).send({ status: false, msg: "Please input authorId!" }) }

        if (authorId || authorId === "") {

            if (!isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, msg: "authorId is invalid!" })
            }
        }

        // if (authorId.length === 0) { res.status(400).send({ status: false, msg: "authorId is empty!" }) }

        let category = req.query.category

        if (!category) { res.status(400).send({ status: false, msg: "Please input category!" }) }

        // if (category.length === 0) { return res.status(404).send({ status: false, msg: "category is empty!" }) }

        let subcategory = req.query.subcategory

        if (subcategory === "") {
            if (!isValidArray(subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory is empty!" })
            }
        }

        let blogsData = []

        let blogs = await blogModel.find({ $or: [{ authorId: authorId }, { tags: tags }, { category: category }, { subcategory: subcategory }] })

        // if (!blogs) { res.status(404).send({ status: false, msg: "DATA NOT FOUND!" }) }



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
        let data = req.body;
        if (Object.keys(data).length === 0) { return res.status(400).send({ msg: "Please provide something to update!" }) }

        let blogId = req.params.blogId
        let authorToken = req.authorId
        // if (!blogId) { res.status(400).send({ status: false, msg: "Please input blogId!" }) };
        // if (!isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "blogId is invalid!" })
        if (blogId || blogId === "") {

            if (!isValidObjectId(blogId)) {
                return res.status(400).send({ status: false, msg: "blogId is invalid!" })
            }
        }

        let blogvalid = await blogModel.findOne({ _id: blogId, isDeleted: false });

        if (!blogvalid) {
            return res.status(404).send({ status: false, msg: "BLOG NOT FOUND!" });
        }

        if (blogvalid.authorId.toString() !== authorToken) { return res.status(401).send({ status: false, message: "Unauthorised access" }) }


        // let updateData = { PublishedAt: new Date(), isPublished: true }
        // updateData.$addToSet={tags:req.body.tags}

        if (!data) { return res.status(400).send({ msg: "Please provide something to update!" }) }

        let uptoDateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true });

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
        let authorToken = req.authorId
        let blogId = await blogModel.findOne({ _id: data, isDeleted: false })

        if (!blogId) {
            return res.status(404).send({ status: false, msg: "DATA NOT FOUND OR DATA ALREADY DELETED!" })
        }
        // if (data != blogId) { res.status(400).send({ status: false, msg: "blogId is invalid!" }) };

        if (blogId.authorId.toString() !== authorToken) { return res.status(401).send({ status: false, message: "Unauthorised access!" }) }

        let savedData = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        return res.status(200).send({ status: true, data: savedData })
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
        const findData = await blogModel.find({ isDeleted: false, isPublished: false }, { authorId, tags, subcategory, category, isPublished })
        if (objectValue.keys(findData) === 0) return res.status(404).send({ status: false, msg: "no data to update!" })
        let allDeletedData = []
        for (i = 0; i < findData.length; i++) {
            if (authorToken.authorId === findData[i].authorId) {
                deletedData = await blogModel.findByIdAndUpdate({ _id: findData[i]._id }, { $set: { isDeleted: true, deletedAt: new Date() } })
                allDeletedData.push(deletedData)
            }
        }
        // const savedData = await blogModel.updateMany(
        //     { $and: [data, { isDeleted: false }] },
        //     { $set: { isDeleted: true, deletedAt: new Date() } },
        //     { new: true }
        // )
        // if (!data) {
        //     return res.status(400).send({ status: false, msg: "BAD REQUEST!" })
        // }

        // if (!isValidObjectId(data.authorId)) {
        //     return res.status(400).send({ status: false, msg: "authorId is invalid!" })
        // }

        // if (data.authorId.length === 0) {
        //     res.status(400).send({ status: false, msg: "authorId is empty!" })
        // }

        // if (!data.category) {
        //     return res.status(404).send({ status: false, msg: "category is required" })
        // }

        // // if (data.category.length === 0) {
        // //     res.status(400).send({ status: false, msg: "category is empty!" })
        // // }

        // if (data.tags.length === 0) {
        //     res.status(400).send({ status: false, msg: "tags is empty!" })
        // }

        // if (data.subcategory.length === 0) {
        //     res.status(400).send({ status: false, msg: "subcategory is empty!" })
        // }

        // if (data.isPublished.length === 0) {
        //     res.status(400).send({ status: false, msg: "isPublished is empty!" })
        // }

        if (allDeletedData.length === 0) {
            return res.status(404).send({ status: false, msg: "NO DATA TO UPDATE!" })
        }
        else res.status(200).send()

        // if (data.authorId.toString() !== authorToken) { return res.status(401).send({ status: false, message: "Unauthorised access" }) }

        // else {
        //     return res.status(200).send({ status: true, data: savedData })
        // }

    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteById = deleteById
module.exports.deleteBlogsByQuery = deleteBlogsByQuery


