// dependencies
const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

// login GET request
exports.getLogin = (req, res) => {
  // redirect logged user to profile page
  if (req.user) {
    return res.redirect("/profile");
  }
  // if not redirected render login page
  res.render("login", {
    title: "Login",
  });
};
// login POST request
exports.postLogin = (req, res, next) => {
  // handle invalid login inputs
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) {
    validationErrors.push({ msg: "Please enter a valid email address."});
  }
  if (!validator.isEmpty(req.body.password)) {
    validationErrors.push({ msg: "Password cannot be blank." });
  }
  //  if validation errors present, display with flash and redirect to login page
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  // normalize request email
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  // passport local strategy authentication
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    // if missing user flash info flagged as error and redirect to login
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login")
    }
    // try loging in user
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // flash success message
      req.flash("success", { msg: "You are logged in." });
    });
  })(req, res, next);  // closure
};
// logging out request
exports.logout = (req, res) => {
  // logout user
  req.logout( () => {
    console.log("User has logged out.");
  })
  // destroy session
  req.session.destroy((err) => {
    if (err) {
      console.log("Error: Failed to destroy the session during logout.", err);
    }
    // clear requests user and redirect to index
    req.user = null;
    res.redirect("/");
  })
}
// Signup GET request
exports.getSignup = (req, res) => {
  // redirect logged users to their profile
  if (req.user) {
    return res.redirect("/profile");
  }
  // render signup page for guests
  res.render("signup", { title: "Create Account", });
}
// Signup POST request
exports.postSignup = (req, res, next) => {
  // invalid request body
  const validationErrors = [];
  // check for entered valid email
  if (!validator.isEmail(req.body.email)) {
    validationErrors.push({ msg: "Please enter a valid email address." });
  }
  // check for minimum length of password
  if (!validator.isLength(req.body.password, { min: 8 })) {
    validationErrors.push({ msg: "Password must be at least 8 characters long" });
  }
  // check for password matching confirmation
  if (req.body.password !== req.body.confirmPassword) {
    validationErrors.push({ msg: "Passwords do not match." });
  }
  if (validationErrors.length) {
    // display erros with flash if any present
    req.flash("errors", validationErrors);
  }

  // normalize received email
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  // create new User object
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });
  // check if User object with same email/name already exists in DB
  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }]},
    (err, existingUser) => {
      // handle generic error
      if (err) {
        return next(err);
      }
      // handle already existing user
      if (existingUser) {
        // display message with flash flagged as error
        req.flash("errors", { msg: "Account with that email or username already exists." });
        // redirect user to signup
        res.redirect("../signup");
      };
      // save user, login and redirect to their profile
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      });
    }
  );
};