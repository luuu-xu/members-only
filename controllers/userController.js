const { body, validationResult } = require('express-validator');

const User = require('../models/user');

exports.user_joinclub_get = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.render('joinclub_form', {
    title: 'Join Club',
  });
}

exports.user_joinclub_post = [
  // Validate and sanitize the fields.
  body('code', 'Code is required.')
    .trim()
    .notEmpty()
    .escape(),

  // Process request after sanitization.
  (req, res, next) => {
    // Extract validation errors.
    const errors = validationResult(req);

    // Redirect to log in page if no user is logged in.
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    }

    if (!errors.isEmpty()) {
      // There are errors. Render the form again without any data.
      res.render('joinclub_form', {
        title: 'Join Club',
        errors: errors.array(),
      });
      return;
    } else {
      // No errors, check the code and update the user object's member_status accordingly.
      User.findById(req.user._id)
        .then((founduser) => {
          if (!founduser) {
            // No user found in DB.
            return next(err);
          }
          if (req.body.code === 'member' || req.body.code === 'regular') {
            // Code entered is correct. Update the user member_status.
            founduser.updateOne({
              member_status: req.body.code,
            }, {})
              .then(() => res.redirect('/'))
              .catch(err => next(err));
          } else if (req.body.code === process.env.CODE_ADMIN) {
            // Code for becoming admin is correct. Update the user to admin.
            founduser.updateOne({
              member_status: 'admin',
            }, {})
              .then(() => res.redirect('/'))
              .catch(err => next(err));
          } else {
            // Code is wrong. Render the form again.
            res.render('joinclub_form', {
              title: 'Join Club',
              error_wrong_code: true,
            });
          }
        })
        .catch(err => next(err));
    }
  }
];