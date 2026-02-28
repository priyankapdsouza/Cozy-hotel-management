const { validationResult } = require('express-validator');
const db = require('../models');

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { foodRating, serviceRating, ambianceRating, comment, orderId } = req.body;

    const feedback = await db.Feedback.create({
      userId: req.user.id,
      orderId: orderId || null,
      foodRating,
      serviceRating,
      ambianceRating,
      comment: comment || null
    });

    const fullFeedback = await db.Feedback.findByPk(feedback.id, {
      include: [{ model: db.User, attributes: ['id', 'name'] }]
    });
    res.status(201).json(fullFeedback);
  } catch (error) {
    next(error);
  }
};

exports.getMyFeedback = async (req, res, next) => {
  try {
    const feedback = await db.Feedback.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

// Admin: Get all feedback
exports.getAll = async (req, res, next) => {
  try {
    const feedback = await db.Feedback.findAll({
      include: [{ model: db.User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};
