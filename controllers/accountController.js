const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const { validationResult } = require("express-validator"); // If you use validation middleware

/* Deliver registration view */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}



/* Process registration */
async function registerAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Simple validation example (use express-validator or similar in real projects)
  if (!account_firstname || !account_lastname || !account_email || !account_password) {
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: ["All fields are required."],
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  try {
    // Check if email already exists
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount) {
      return res.status(400).render("account/register", {
        title: "Register",
        nav,
        errors: ["Email is already registered."],
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Store new account
    const regResult = await accountModel.registerAccount({
      account_firstname,
      account_lastname,
      account_email,
      account_password: hashedPassword,
    });

    if (regResult) {
      req.flash("success", "Registration successful. Please log in.");
      return res.redirect("/account/login");
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    next(error);
  }
}

/* Deliver login view */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    errors: null,
    nav,
  });
}

/* Process login */
async function accountLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;

      // Store user data in session
      req.session.accountData = accountData;
      req.session.loggedin = true;

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    return next(error);
  }
}

/* Deliver account management view */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  if (!req.session.loggedin) {
    return res.redirect("/account/login");
  }
  const accountData = req.session.accountData;

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData,
    errors: null,
  });
}

/* Deliver account update view */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav();
  if (!req.session.loggedin) {
    return res.redirect("/account/login");
  }
  // For security, verify the requested accountId matches session user or admin rights
  const accountId = req.params.accountId;
  const accountData = req.session.accountData;

  if (accountId != accountData.account_id) {
    // Optionally handle unauthorized access
    return res.redirect("/account/");
  }

  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData,
    errors: null,
  });
}

/* Process account update */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  if (!req.session.loggedin) {
    return res.redirect("/account/login");
  }

  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const accountData = req.session.accountData;

  if (account_id != accountData.account_id) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const updateResult = await accountModel.updateAccount({
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });

    if (updateResult) {
      // Update session data
      req.session.accountData.account_firstname = account_firstname;
      req.session.accountData.account_lastname = account_lastname;
      req.session.accountData.account_email = account_email;

      req.flash("success", "Account updated successfully.");
      return res.redirect("/account/");
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    next(error);
  }
}

/* Process password update */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  if (!req.session.loggedin) {
    return res.redirect("/account/login");
  }

  const { account_id, new_password } = req.body;
  const accountData = req.session.accountData;

  if (account_id != accountData.account_id) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const passwordUpdateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (passwordUpdateResult) {
      req.flash("success", "Password updated successfully.");
      return res.redirect("/account/");
    } else {
      throw new Error("Password update failed");
    }
  } catch (error) {
    next(error);
  }
}

/* Logout - destroy session */
function accountLogout(req, res, next) {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid"); // or your session cookie name
    res.redirect("/");
  });
}

module.exports = {
  buildRegister,
  registerAccount,
  buildLogin,
  accountLogin,
  buildAccountManagementView,
  buildUpdate,
  updateAccount,
  updatePassword,
  accountLogout,
};
