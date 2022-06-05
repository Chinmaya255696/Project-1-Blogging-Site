const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")

router.post("/createbookData", bookController.createbookData)

router.get("/getbookData", bookController.getbookData)

module.exports = router;