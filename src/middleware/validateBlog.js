const { check, validationResult } = require("express-validator")

const validateBlog = [
    check("title" || "body" || "category")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please input title, body, category and authorId!"),

    check("title")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please input title!")
        .isLength({ min: 4, max: 70 })
        .withMessage("Title name must be 4 to 70 characters long!"),


    check("body")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Body is missing!")
        .isLength({ min: 5, max: 10000 })
        .withMessage("Blog content must be 5 to 10000 characters long!"),

    check("category")
        .trim()
        .not()
        .isEmpty()
        .withMessage("category is missing or invalid!")
        .isLength({ min: 3, max: 100 })
        .withMessage("category must be 3 to 100 characters long!")



]

const validate2 = function (req, res, next) {
    const error = validationResult(req).array()
    if (!error.length) return next()
    res.status(400).send({ status: false, msg: error[0].msg })
}

module.exports = { validateBlog, validate2 }