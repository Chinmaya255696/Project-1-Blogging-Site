const jwt = require("jsonwebtoken");

//======================================================1st Middleware===================================================================//

const authenticate = function (req, res, next) {
try{
    let token = req.headers["X-api-key"];
    if (!token) token = req.headers["x-api-key"];
    if (!token) return res.status(404).send({ status: false, msg: "token must be present" });
    console.log(token);
    let decodedToken = jwt.verify(token, "group19-project1");
    if (!decodedToken) {
        return res.status(400).send({ status: false, msg: "token is invalid" });
    }
    next()
}
catch (err) {
    console.log("This is the error:", err.message)
    return res.status(500).send({ status: false, msg: err.message })
}
}

//====================================================2nd Middleware=====================================================================//

const authorise = function (req, res, next) {
    try{
    let token = req.headers["x-api-key"];
    let decodedToken = jwt.verify(token, "group19-project1");
    let userToBeModified = req.params.authorId
    let userLoggedIn = decodedToken.authorId
    if (userToBeModified != userLoggedIn) return res.status(400).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })

    next()
}
catch (err) {
    console.log("This is the error:", err.message)
    return res.status(500).send({ status: false, msg: err.message })
}
}

//=========================================================================================================================================//

module.exports = { authenticate, authorise }