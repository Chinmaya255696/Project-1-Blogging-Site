const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const { validateAuthor, validate } = require("../middleware/validateAuthor")
const { validateBlog, validate2 } = require("../middleware/validateBlog")
const middleware = require("../middleware/auth");

router.post("/authors", validateAuthor, validate, authorController.createAuthor)

router.post("/login", authorController.loginAuthor)

router.post("/blogs", validateBlog, validate2, middleware.authenticate, blogController.createBlog)

router.get("/getAllBlogs", middleware.authenticate, blogController.getAllBlogs)

router.put("/blogs/:blogId", middleware.authenticate, middleware.authorise, blogController.updateBlog)

router.delete("/blogs/:blogId", middleware.authenticate, middleware.authorise, blogController.deleteById)

router.delete("/blogsByQueryParams", middleware.authenticate, blogController.deleteBlogsByQuery)


module.exports = router;