const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, tableController.getAll);
router.post('/', auth, adminOnly, tableController.create);
router.put('/:id', auth, adminOnly, tableController.update);

module.exports = router;
