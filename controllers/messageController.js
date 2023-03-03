const Message = require('../models/message');

const { body, validationResult } = require('express-validator');

// Display new message form on GET.
exports.message_create_get  = (req, res, next) => {
  // Redirect to login page if no user is logged in.
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  res.render('message_form', {
    title: 'New Message',
  });
}

// Handle new message form on POST.
exports.message_create_post = [
  // Validate and sanitize the fields.
  body('title', 'Title is required.')
    .trim()
    .notEmpty()
    .escape(),
  body('message', 'Message is required.')
    .trim()
    .notEmpty()
    .escape(),
  
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract errors from a req.
    const errors = validationResult(req);

    // Redirect to log in page if no user is logged in.
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    }

    // Create a Message object with sanitized data.
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      author: req.user._id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized data.
      res.render('message_form', {
        title: 'New Message',
        message: message,
        errors: errors.array(),
      });
      return;
    } else {
      // There are no errors. Save the message.
      message.save()
        .then(() => {
          res.redirect('/');
        })
        .catch((err) => {
          return next(err);
        });
    }
  }
];

// Handle message delete on POST.
exports.message_delete_post = (req, res, next) => {
  // Redirect to log in page if the current user is not admin.
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else if (req.user.member_status !== 'admin') {
    res.redirect('/');
  } else {
    // Current logged in user is admin, delete the message.
    Message.findByIdAndDelete(req.body.messageid)
      .then(() => res.redirect('/'))
      .catch(err => next(err));
  }
}