const express = require("express");
const router = express.Router();
const path = require("path");

// Remove or comment this line if you don't need handleErrors here
// const utilities = require("../utilities");

// Serve static CSS directly
router.use("/css", express.static(path.join(__dirname, "../public/css")));

module.exports = router;

