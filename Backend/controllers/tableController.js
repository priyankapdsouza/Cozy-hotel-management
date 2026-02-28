const { validationResult } = require('express-validator');
const db = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const tables = await db.Table.findAll({
      where: { isActive: true },
      order: [['tableNumber']]
    });
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

// Admin: Create table
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const table = await db.Table.create(req.body);
    res.status(201).json(table);
  } catch (error) {
    next(error);
  }
};

// Admin: Update table
exports.update = async (req, res, next) => {
  try {
    const table = await db.Table.findByPk(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found.' });
    }
    await table.update(req.body);
    res.json(table);
  } catch (error) {
    next(error);
  }
};
