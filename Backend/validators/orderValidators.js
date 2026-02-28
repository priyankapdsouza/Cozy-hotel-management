const { body } = require('express-validator');

exports.createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('items.*.menuItemId').isInt().withMessage('Invalid menu item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

exports.paymentValidator = [
  body('paymentMethod')
    .isIn(['card', 'netbanking', 'cod'])
    .withMessage('Invalid payment method'),

  // Card payment validation
  body('cardHolderName')
    .if(body('paymentMethod').equals('card'))
    .notEmpty()
    .withMessage('Card holder name is required'),

  body('cardNumber')
    .if(body('paymentMethod').equals('card'))
    .isCreditCard()
    .withMessage('Invalid card number'),

  body('expiryMonth')
    .if(body('paymentMethod').equals('card'))
    .isInt({ min: 1, max: 12 })
    .withMessage('Expiry month must be between 1 and 12'),

  body('expiryYear')
    .if(body('paymentMethod').equals('card'))
    .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 20 })
    .withMessage('Expiry year is not valid'),

  body('cvv')
    .if(body('paymentMethod').equals('card'))
    .isLength({ min: 3, max: 4 })
    .withMessage('CVV must be 3 or 4 digits')
    .bail()
    .isNumeric()
    .withMessage('CVV must contain only digits'),

  // Billing address validation for card payments
  body('billingAddressLine1')
    .if(body('paymentMethod').equals('card'))
    .notEmpty()
    .withMessage('Billing address is required'),

  body('billingCity')
    .if(body('paymentMethod').equals('card'))
    .notEmpty()
    .withMessage('Billing city is required'),

  body('billingPostalCode')
    .if(body('paymentMethod').equals('card'))
    .isLength({ min: 4, max: 10 })
    .withMessage('Postal code length is invalid')
    .bail()
    .matches(/^[0-9A-Za-z\-\\s]+$/)
    .withMessage('Postal code format is invalid')
];
