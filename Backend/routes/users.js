const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');
const validators = require('../validators/userValidators');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, validators.updateProfileValidator, userController.updateProfile);
router.get('/bookings', auth, userController.getBookingHistory);
router.get('/orders', auth, userController.getOrderHistory);
router.get('/', auth, adminOnly, userController.getAllUsers);

module.exports = router;
