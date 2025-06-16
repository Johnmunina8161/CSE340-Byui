const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Registration routes
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);

// Login routes
router.get("/login", accountController.buildLogin);
router.post("/login", accountController.accountLogin);

// Account management routes (require login)
router.get("/", utilities.checkLogin, accountController.buildAccountManagementView);

// Update account info
router.get("/update/:accountId", utilities.checkLogin, accountController.buildUpdate);
router.post("/update", utilities.checkLogin, accountController.updateAccount);

// Update password
router.post("/updatePassword", utilities.checkLogin, accountController.updatePassword);

// Logout route with session destruction
router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.redirect("/");
  });
});

module.exports = router;
