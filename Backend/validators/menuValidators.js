const { body } = require('express-validator');

exports.menuItemValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('categoryId').isInt().withMessage('Category is required'),
  body('isAvailable').optional().isBoolean()
];
