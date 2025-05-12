/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
require('dotenv').config(); // Load environment variables
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");

/* ***********************
 * Create Express App
 *************************/
const app = express();

/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // EJS layout file path
app.set("views", path.join(__dirname, "views")); // Path to views

/* ***********************
 * Routes
 *************************/
// Root route - render views/index.ejs
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});


/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});