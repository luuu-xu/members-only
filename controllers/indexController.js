const Message = require('../models/message');

// Display index page with a list of messages on GET.
exports.index_get = async function(req, res, next) {
  const list_messages = 
    await Message.find().sort({ timestamp: -1 }).limit(10).populate('author');
  res.render('index', {
    user: req.user,
    message_list: list_messages,
  });
}