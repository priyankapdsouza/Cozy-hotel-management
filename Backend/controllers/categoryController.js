const { validationResult } = require('express-validator');
const db = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await db.Category.findAll({
      order: [['name']]
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await db.Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await db.Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await category.update(req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const category = await db.Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
