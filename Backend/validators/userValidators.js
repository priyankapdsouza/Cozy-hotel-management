const { body } = require('express-validator');

exports.updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().trim().matches(/^[0-9+\-\s()]{10,20}$/).withMessage('Invalid phone format'),
  body('address').optional().trim()
];
