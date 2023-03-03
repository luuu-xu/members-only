var express = require('express');

var router = express.Router();

// Require controller modules.
const message_controller = require('../controllers/messageController');

// GET and POST for creating a new message.
router.get('/newmessage', message_controller.message_create_get);

router.post('/newmessage', message_controller.message_create_post);

// POST for deleting a message.
router.post('/deletemessage', message_controller.message_delete_post);

module.exports = router;