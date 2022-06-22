const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController =  require("../controllers/blogController")

router.post("/authors", authorController.createAuthor)

router.post("/blogs", blogController.createBlog)

router.get("/blogs", blogController.getAllBlogs)

router.put("/blogs/:blogId", blogController.updateBlog)

router.delete("/blogs/:blogId", blogController.deleteById)

router.delete("/blogs", blogController.deleteBlogsByQuery)







module.exports = router;