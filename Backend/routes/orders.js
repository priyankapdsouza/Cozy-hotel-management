const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');
const validators = require('../validators/orderValidators');

router.post('/', auth, validators.createOrderValidator, orderController.createOrder);
router.get('/my', auth, orderController.getMyOrders);
router.get('/all', auth, adminOnly, orderController.getAllOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/status', auth, adminOnly, orderController.updateOrderStatus);
router.delete('/:id', auth, orderController.cancelOrder);
router.post('/:id/payment', auth, validators.paymentValidator, orderController.processPayment);

module.exports = router;
