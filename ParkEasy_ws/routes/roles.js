var express = require('express');
var router = express.Router();

const rolesController = require('../controllers').rolesController;

router.get('/', rolesController.list);

module.exports = router;