var express = require('express');
var router = express.Router();

// Require controller modules.
const index_controller = require('../controllers/indexController');

/* GET home page. */
router.get('/', index_controller.index_get);

module.exports = router;
