const { validationResult } = require('express-validator');
const db = require('../models');
const { generateOrderNumber } = require('../utils/orderNumber');

const TAX_RATE = 0.1;
const calculateOrder = (orderItems) => {
  const subtotal = orderItems.reduce((sum, i) => sum + parseFloat(i.totalPrice), 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, tax, discount: 0, total };
};

exports.createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    const orderItems = [];
    for (const cartItem of items) {
      const menuItem = await db.MenuItem.findByPk(cartItem.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: 'Menu item not found.' });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: menuItem.name + ' is not available.' });
      }
      const qty = parseInt(cartItem.quantity) || 1;
      const unitPrice = parseFloat(menuItem.price);
      const totalPrice = unitPrice * qty;
      orderItems.push({
        menuItemId: menuItem.id,
        quantity: qty,
        unitPrice,
        totalPrice
      });
    }

    const { subtotal, tax, discount, total } = calculateOrder(orderItems);
    const orderNumber = generateOrderNumber();

    const order = await db.sequelize.transaction(async (t) => {
      const newOrder = await db.Order.create({
        userId: req.user.id,
        orderNumber,
        subtotal,
        tax,
        discount,
        total,
        status: 'pending',
        paymentStatus: 'pending'
      }, { transaction: t });

      for (const oi of orderItems) {
        await db.OrderItem.create({
          orderId: newOrder.id,
          menuItemId: oi.menuItemId,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
          totalPrice: oi.totalPrice
        }, { transaction: t });
      }

      return newOrder;
    });

    const fullOrder = await db.Order.findByPk(order.id, {
      include: [{ model: db.OrderItem, include: [db.MenuItem] }]
    });
    res.status(201).json(fullOrder);
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await db.Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: db.OrderItem, include: [db.MenuItem] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await db.Order.findByPk(req.params.id, {
      include: [{ model: db.OrderItem, include: [db.MenuItem] }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (req.user.role === 'customer' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await db.Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    order.status = status;
    await order.save();

    const fullOrder = await db.Order.findByPk(order.id, {
      include: [{ model: db.OrderItem, include: [db.MenuItem] }]
    });
    res.json(fullOrder);
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await db.Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (req.user.role === 'customer' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel a delivered order.' });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.processPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await db.Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { paymentMethod } = req.body;
    const validMethods = ['card', 'netbanking', 'cod'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method.' });
    }

    order.paymentMethod = paymentMethod;
    order.paymentStatus = 'paid';
    await order.save();

    const fullOrder = await db.Order.findByPk(order.id, {
      include: [{ model: db.OrderItem, include: [db.MenuItem] }]
    });
    res.json(fullOrder);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        { model: db.OrderItem, include: [db.MenuItem] },
        { model: db.User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
