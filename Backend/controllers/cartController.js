const db = require('../models');

exports.getCart = async (req, res, next) => {
  try {
    const items = await db.CartItem.findAll({
      where: { userId: req.user.id },
      include: [db.MenuItem]
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (!menuItemId || !qty || qty <= 0) {
      return res
        .status(400)
        .json({ message: 'menuItemId and positive quantity are required.' });
    }

    let item = await db.CartItem.findOne({
      where: { userId: req.user.id, menuItemId }
    });

    if (item) {
      item.quantity += qty;
      await item.save();
    } else {
      item = await db.CartItem.create({
        userId: req.user.id,
        menuItemId,
        quantity: qty
      });
    }

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);
    const { id } = req.params;

    const item = await db.CartItem.findOne({
      where: { id, userId: req.user.id }
    });

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    if (!qty || qty <= 0) {
      await item.destroy();
      return res.json({ message: 'Item removed from cart.' });
    }

    item.quantity = qty;
    await item.save();
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    await db.CartItem.destroy({ where: { userId: req.user.id } });
    res.json({ message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};

