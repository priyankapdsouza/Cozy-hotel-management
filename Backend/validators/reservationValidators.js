const { body } = require('express-validator');

exports.createReservationValidator = [
  body('tableId').isInt().withMessage('Valid table is required'),
  body('reservationDate').isDate().withMessage('Valid date is required'),
  body('reservationTime').notEmpty().withMessage('Time is required'),
  body('guests').optional().isInt({ min: 1, max: 20 }).withMessage('Guests must be 1-20'),
  body('specialRequests').optional().trim()
];
