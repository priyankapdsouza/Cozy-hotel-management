const express = require('express');
const router = express.Router();
const { auth, customerOnly } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.get('/', auth, customerOnly, cartController.getCart);
router.post('/', auth, customerOnly, cartController.addToCart);
router.put('/:id', auth, customerOnly, cartController.updateCartItem);
router.delete('/', auth, customerOnly, cartController.clearCart);

module.exports = router;

