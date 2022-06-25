const { check, validationResult } = require("express-validator")

const validateAuthor = [
    check("fname" || "lname" || "title" || "email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please input fname, lname, title and email!"),

    check("fname")
        .trim()
        .not()
        .isEmpty()
        .withMessage("First name is missing!")
        .isLength({ min: 2, max: 30 })
        .withMessage("First name must be 2 to 30 characters long!"),

    check("lname")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Last name is missing!")
        .isLength({ min: 2, max: 30 })
        .withMessage("Last name must be 2 to 30 characters long!"),

    check("title")
        .isIn(["Mr", "Mrs", "Miss"])
        .withMessage("Invalid Title!")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Title is missing!")
        .isLength({ min: 2, max: 4 })
        .withMessage("Title name must be 2 to 4 characters long!"),

    check("email")
        .normalizeEmail()
        .isEmail()
        .withMessage("Email is invalid!"),

    check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is missing!")
        .isLength({ min: 5, max: 20 })
        .withMessage("Password must be 5 to 20 characters long!")
];

const validate = function (req, res, next) {
    const error = validationResult(req).array()
    if (!error.length) return next()
    res.status(400).send({ status: false, msg: error[0].msg })
}

module.exports = { validateAuthor, validate }