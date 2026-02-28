const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { auth, adminOnly } = require('../middleware/auth');
const validators = require('../validators/reservationValidators');

router.get('/availability', auth, reservationController.checkAvailability);
router.get('/my', auth, reservationController.getMyReservations);
router.get('/all', auth, adminOnly, reservationController.getAllReservations);
router.get('/:id', auth, reservationController.getReservationById);
router.post('/', auth, validators.createReservationValidator, reservationController.createReservation);
router.put('/:id', auth, validators.createReservationValidator, reservationController.updateReservation);
router.delete('/:id', auth, reservationController.cancelReservation);

module.exports = router;
