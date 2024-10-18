
var express = require('express');
var router = express.Router();

const vehiclesController = require('../controllers').vehiclesController;

router.get('/full', vehiclesController.listFull);
router.get('/', vehiclesController.list);
router.get('/check', vehiclesController.checkVehicleExistence);
router.get('/:id', vehiclesController.getById);
router.post('/', vehiclesController.add);
router.put('/:id', vehiclesController.update);
router.delete('/:id', vehiclesController.delete);


module.exports = router;
