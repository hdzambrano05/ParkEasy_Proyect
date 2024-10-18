
var express = require('express');
var router = express.Router();

const parking_spacesController = require('../controllers').parking_spacesController;


router.get('/', parking_spacesController.list);
router.get('/full', parking_spacesController.listFull);
router.get('/:id', parking_spacesController.getById);
router.post('/', parking_spacesController.add);
router.put('/:id', parking_spacesController.update);
router.delete('/:id', parking_spacesController.delete);


module.exports = router;
