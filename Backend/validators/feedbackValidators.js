const { body } = require('express-validator');

exports.feedbackValidator = [
  body('foodRating').isInt({ min: 1, max: 5 }).withMessage('Food rating 1-5 required'),
  body('serviceRating').isInt({ min: 1, max: 5 }).withMessage('Service rating 1-5 required'),
  body('ambianceRating').isInt({ min: 1, max: 5 }).withMessage('Ambiance rating 1-5 required'),
  body('comment').optional().trim(),
  body('orderId').optional().isInt()
];
