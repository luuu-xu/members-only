const User = require('../models/user');

const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Display User sign up form on GET.
exports.auth_signup_get = (req, res, next) => {
  res.render('signup_form', {
    title: 'Sign Up',
  });
}

// Handle User sign up on POST.
exports.auth_signup_post = [
  // Validate and sanitize the fields.
  body('name', 'Name is required.')
    .trim()
    .notEmpty()
    .escape(),
  body('username')
    .trim()
    .isEmail()
    .withMessage('Email is not valid.')
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Email is already signed up.')
      }
      return true;
    })
    .normalizeEmail(),
  body('password', 'Password must be at least 6 characters long.')
    .trim()
    .isLength({ min: 6 })
    .escape(),
  body('confirmpw')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.')
      }
      return true;
    })
    .escape(),
  
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a User object with escaped and trimmed data, without password.
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      member_status: 'regular',
    });

    if(!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('signup_form', {
        title: 'Sign Up',
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Form data is valid.
      // Hash the password and save the user record to db.
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        user.password = hashedPassword;
        user.save()
          .then(() => {
            // User saved. Log in the user and redirect to index page.
            req.login(user, (err) => {
              if (err) {
                return next(err);
              }
              res.redirect('/');
            });
          })
          .catch((err) => {
            return next(err);
          });
      });
    }
  }
];

// Display user log in form on GET.
exports.auth_login_get = (req, res) => {
  if (req.isAuthenticated()) {
    // console.log('current user is authenticated');
    res.redirect('/');
  }
  res.render('login_form', {
    title: 'Log In',
  });
}

// passport LocalStrategy setup
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return done(err);
          }
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
        });
      })
      .catch((err) => {
        return done(err);
      });
  })
);

// passport session setup
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((founduser) => {
      done(null, founduser);
    })
    .catch((err) => {
      return done(err);
    });
});

// Handle user log in on POST.
exports.auth_login_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
});

// Handle user log out on GET.
exports.auth_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}
