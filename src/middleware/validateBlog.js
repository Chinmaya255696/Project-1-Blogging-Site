const { check, validationResult } = require("express-validator")

const validateBlog = [
    check("title")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Title is missing!")
        .isLength({ min: 4, max: 70 })
        .withMessage("Title name must be 4 to 70 characters long!"),

    check("body")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Body is missing!")
        .isLength({ min: 5, max: 10000 })
        .withMessage("Blog content must be 5 to 10000 characters long!"),

    check("tags")
        .trim()
        .not()
        .isEmpty()
        .withMessage("tag is missing! or tags are missing!")
        .isLength({ min: 3, max: 100 })
        .withMessage("Please enter proper tags!"),

    check("category")
        .trim()
        .not()
        .isEmpty()
        .withMessage("category is missing!")
        .isLength({ min: 3, max: 100 })
        .withMessage("Please enter valid category!"),

    check("subcategory")
        .trim()
        .not()
        .isEmpty()
        .withMessage("subcategory is missing!")
        .isLength({ min: 3, max: 100 })
        .withMessage("Please enter valid subcategory!"),

    check("isDeleted")
        .trim()
        .not()
        .isEmpty()
        .withMessage("isDeleted is missing!")
        .isLength({ min: 4, max: 4 })
        .withMessage("Please enter valid value of isDeleted!"),

    check("isPublised")
        .trim()
        .not()
        .isEmpty()
        .withMessage("isPublised is missing!")
        .isLength({ min: 4, max: 4 })
        .withMessage("Please enter valid value of isPublised!"),


]

const validate2 = function (req, res, next) {
    const error = validationResult(req).array()
    if (!error.length) return next()
    res.status(400).send({ status: false, msg: error[0].msg })
}

module.exports = { validateBlog, validate2 }