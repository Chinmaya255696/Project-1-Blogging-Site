const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const middleware = require("../middleware/middleware")

router.post("/authors", authorController.createAuthor)

router.post("/blogs", middleware.authenticate, blogController.createBlog)

router.post("/login", authorController.loginAuthor)

router.get("/getAllBlogs", middleware.authenticate, blogController.getAllBlogs)

router.put("/blogs/:blogId", middleware.authenticate, middleware.authorise, blogController.updateBlog)

router.delete("/blogs/:blogId", middleware.authenticate, middleware.authorise, blogController.deleteById)

router.delete("/blogs", middleware.authenticate, middleware.authorise, blogController.deleteBlogsByQuery)


module.exports = router;