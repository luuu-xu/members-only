const User = require('../models/user');

const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');


// Display User craete form on GET.
exports.user_create_get = (req, res, next) => {
  res.render('user_form', {
    title: 'Sign Up',
  });
}

// Handle User craete on POST.
exports.user_create_post = [
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
      res.render('user_form', {
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
            // User saved. 
            // TODO: Automatically sign in.
            res.render('user_form', {
              title: 'success',
              user: user,
            });
          })
          .catch((err) => {
            return next(err);
          });
      });
    }
  }
];