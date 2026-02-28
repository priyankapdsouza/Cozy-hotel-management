const { validationResult } = require('express-validator');
const db = require('../models');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, address } = req.body;
    const user = await db.User.findByPk(req.user.id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();
    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.getBookingHistory = async (req, res, next) => {
  try {
    const reservations = await db.Reservation.findAll({
      where: { userId: req.user.id },
      include: [{ model: db.Table }],
      order: [['reservationDate', 'DESC'], ['reservationTime', 'DESC']]
    });
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

exports.getOrderHistory = async (req, res, next) => {
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

// Admin: Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
