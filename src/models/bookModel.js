const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema( {
bookName: {
    type: String,
    unique: true,
    required: true
},
authorName: {
    type: String,
    required: true
},
category: {
    type: String,
    enum: ["Fiction", "Nonfiction", "Drama" , "Poetry" , "Folktale"] },
year: Number
}, {timestamps: true});

module.exports = mongoose.model('Book', bookSchema) //books