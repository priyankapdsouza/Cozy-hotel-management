const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../config/multer').single('image');
const validators = require('../validators/menuValidators');

router.get('/', menuController.getAll);
router.get('/:id', menuController.getById);
router.post('/', auth, adminOnly, upload, validators.menuItemValidator, menuController.create);
router.put('/:id', auth, adminOnly, upload, validators.menuItemValidator, menuController.update);
router.delete('/:id', auth, adminOnly, menuController.delete);

module.exports = router;
