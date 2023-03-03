const Message = require('../models/message');

// Display index page with a list of messages on GET.
exports.index_get = (req, res, next) => {
  Message.find().sort({ timestamp: -1 }).limit(10).populate('author')
    .then((list_messages) => {
      res.render('index', {
        user: req.user,
        message_list: list_messages,
      });
    })
    .catch(err => next(err));
}