const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { auth, adminOnly } = require('../middleware/auth');
const validators = require('../validators/feedbackValidators');

router.post('/', auth, validators.feedbackValidator, feedbackController.create);
router.get('/my', auth, feedbackController.getMyFeedback);
router.get('/all', auth, adminOnly, feedbackController.getAll);

module.exports = router;
