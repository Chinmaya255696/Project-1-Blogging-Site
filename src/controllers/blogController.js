const blogModel = require("../models/blogModel")

const createBlog = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length != 0) {
            let savedData = await blogModel.create(data)
            res.status(201).send({ msg: savedData })
        }
        else res.status(400).send({ msg: "BAD REQUEST" })
    }
    catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const getAllBlogs = async function (req, res) {
    try {
        let data = req.query
        let savedData = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] })
        if (Object.keys(data).length != 0) {
            return res.status(200).send({ status: true, data: savedData });
        }
        let findByQuery = await blogModel.find({ $or: [{ subcategory: req.query.subcategory }, { authorId: req.query.authorId }, { tags: req.query.tags }, { category: req.query.category }] })
        let final = []
        if (findByQuery.length > 0) {
            for (let i of findByQuery) {
                if (i.isDeleted == false && i.isPublished == true) {
                    final.push(i)
                }
            }
        }
        return res.status(200).send({ status: true, msg: final })
    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })

    }
}

const updateBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId
        let blogvalid = await blogModel.findOne({ _id: blogId, isDeleted: false });


        if (!blogvalid) {
            return res.status(404).send({ status: false, msg: "the blog has already been deleted from database" });
        }
        else {
            let data = req.body;
            if (!data) { return res.status(404).send({ status: false, msg: "DATA NOT FOUND" }) }
            let uptodateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, data, { $set: { isPublished: true, publishedAt: new Date() } });
            res.status(200).send({ status: true, data: uptodateBlog });
        }

    } catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
};

const deleteById = async function (req,res) {
   try {
    let data = req.params.blogId 
    let blogId = await blogModel.findById({_id: data , isDeleted:false})
    if (!blogId){
        res.status(404).send({status:false , msg: "DATA NOT FOUND OR DATA ALREADY DELETED" })
    }
    let savedData = await blogModel.findOneAndUpdate({_id: blogId},{isDeleted: true })
    res.status(200).send({status:true , data: savedData})
}
catch (error) {
    res.status(500).send({ msg: "Error", error: error.message })
}
    
}

const deleteBlogsByQuery = async function (req, res) {
    try {
        let data = req.query
        const savedData = await blogModel.updateMany(
            { $and: [data, { isDeleted: false }] },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        )
        if (!data){
            return res.status(404).send({ status: false, msg: "Document not found" })}

            else{
            res.status(200).send({status: true, data: savedData})
            console.log(savedData)}

    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteById = deleteById
module.exports.deleteBlogsByQuery = deleteBlogsByQuery

//phase 1 completed


