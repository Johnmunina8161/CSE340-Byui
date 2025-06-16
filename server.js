/******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const session = require("express-session")
const flash = require("connect-flash")
const messages = require("express-messages")
const app = express()

const pool = require("./database/")
const utilities = require("./utilities/index")
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")


/* ***********************
 * Middleware
 *************************/

// Session setup with PostgreSQL store (✅ only once!)
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// ✅ Make session data available to EJS views
app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin || false
  res.locals.accountData = req.session.accountData || null
  next()
})


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // Path to the layout file

// Body-parsing middleware for POST form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Static file middleware (for CSS, JS, images)
app.use(express.static("public"))

/* ************************
 * Routes
 **************************/
app.use(require("./routes/static"))
// Index route - Unit 3, activity
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes - Unit 3, activity
app.use("/inv", require("./routes/inventoryRoute"))
// Account routes - Unit 4, activity
app.use("/account", require("./routes/accountRoute"))

/* ***********************
 * File Not Found Route - must be last route in list
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message = err.status == 404
    ? err.message
    : "Oh no! There was a crash. Maybe try a different route?"
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})
