
var express = require('express');
var router = express.Router();

const reservationsController = require('../controllers').reservationsController;


router.get('/', reservationsController.list);
router.get('/earnings/monthly', reservationsController.getMonthlyEarnings);
router.get('/active/:userId', reservationsController.getActiveReservation);
router.get('/full', reservationsController.listFull);
router.get('/:id', reservationsController.getById);
router.post('/', reservationsController.add);
router.put('/exit/:id',reservationsController.markExit);
router.put('/:id', reservationsController.update);
router.delete('/:id', reservationsController.delete);



module.exports = router;
