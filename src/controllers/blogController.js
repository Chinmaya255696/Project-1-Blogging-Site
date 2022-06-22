const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {
    try {
        let data = req.body
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
        let tags = req.query.tags
        let authorId = req.query.authorId
        if (!authorId) { res.status(400).send({ status: false, msg: "Please input authorId!" }) }
        let category = req.query.category
        if (!category) { res.status(400).send({ status: false, msg: "Please input category!" }) }
        let subcategory = req.query.subcategory
        let blogsData = []
        let blogs = await blogModel.find({ $or: [{ authorId: authorId }, { tags: tags }, { category: category }, { subcategor: subcategory }] })

        if (!blogs) { res.status(400).send({ status: false, msg: "BAD REQUEST!" }) }

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
        let blogId = req.params.blogId
        let blogvalid = await blogModel.findOne({ _id: blogId, isDeleted: false });
        if (!blogvalid) {
            return res.status(404).send({ status: false, msg: "BLOG NOT FOUND!" });
        }

        else {
            let data = req.body;
            if (!data) { return res.status(400).send({ msg: "BAD REQUEST!" }) }
            if (!data.tag && !data.subcategory) { return res.status(404).send({ status: false, msg: "Please input both tag and subcategory" }) }
            let uptoDateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, data, { new: true });
            let updated = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isPublished: true, publishedAt: new Date() } }, { new: true })
            return res.status(200).send({ status: true, data: updated });
        }

    } catch (err) {
        console.log("This is the error:", err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
};

const deleteById = async function (req, res) {
    try {
        let data = req.params.blogId
        let blogId = await blogModel.findById({ _id: data, isDeleted: false })
        if (!blogId) {
            return res.status(404).send({ status: false, msg: "DATA NOT FOUND OR DATA ALREADY DELETED" })
        }
        let savedData = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
        return res.status(200).send({ status: true, data: savedData })
    }
    catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
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
        if (!data) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST" })
        }

        if (!data.authorId) {
            return res.status(404).send({ status: false, msg: "authorId is required" })
        }

        if (savedData.modifiedCount === 0) {
            return res.status(404).send({ status: false, msg: "DATA NOT FOUND" })
        }
        else {
            return res.status(200).send({ status: true, data: savedData })

        }

    } catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteById = deleteById
module.exports.deleteBlogsByQuery = deleteBlogsByQuery




