const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validators = require('../validators/authValidators');

router.post('/register', validators.registerValidator, authController.register);
router.post('/login', validators.loginValidator, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/change-password', auth, validators.changePasswordValidator, authController.changePassword);
router.post('/logout', auth, authController.logout);

module.exports = router;
