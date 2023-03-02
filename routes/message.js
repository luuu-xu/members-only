var express = require('express');

var router = express.Router();

// Require controller modules.
const message_controller = require('../controllers/messageController');

// GET and POST for creating a new message.
router.get('/newmessage', message_controller.message_create_get);

router.post('/newmessage', message_controller.message_create_post);

// GET for displaying a list of messages.
// router.get('/', message_controller.message_list_get);

module.exports = router;