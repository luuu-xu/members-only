var express = require('express');
var router = express.Router();

// Require controller modules.
const user_controller = require('../controllers/userController');

// ---------------- SIGN UP -----------------
router.get('/signup', user_controller.user_create_get);

router.post('/signup', user_controller.user_create_post);

module.exports = router;