var express = require('express');

var router = express.Router();

// Require controller modules.
const auth_controller = require('../controllers/authController');

// ---------------- SIGN UP -----------------
router.get('/signup', auth_controller.auth_signup_get);

router.post('/signup', auth_controller.auth_signup_post);


// ---------------- LOG IN ------------------
router.get('/login', auth_controller.auth_login_get);

router.post('/login', auth_controller.auth_login_post);

// ---------------- LOG OUT -----------------
router.get('/logout', auth_controller.auth_logout_get);

module.exports = router;