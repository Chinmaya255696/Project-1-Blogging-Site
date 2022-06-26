const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const validator = require("validator")
const mixedType = mongoose.Schema.Types.Mixed


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "Project_Author",
        required: true
    },
    tags: {
        type: [String],
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: [String]
    },
    // createdAt: {
    //     type: String,
    //     default: null
    // },
    // updatedAt: {
    //     type: String,
    //     default: null
    // },
    deletedAt: {
        type: String,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false,
        // validate(value) {
        //     if (!validator.isBoolean(value)) {
        //         throw new Error("Invalid Response");
        //     }
        // }
    },
    publishedAt: {
        type: String,
        default: null
    },
    isPublished: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });

module.exports = mongoose.model('Project_Blog', blogSchema) 