var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/userController');

/* GET user join club form. */
router.get('/joinclub', user_controller.user_joinclub_get);

// POST user join club form.
router.post('/joinclub', user_controller.user_joinclub_post);

module.exports = router;
