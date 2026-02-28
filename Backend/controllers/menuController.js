const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const db = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { categoryId, minPrice, maxPrice, search, isAvailable } = req.query;
    const where = {};
    if (categoryId) where.categoryId = categoryId;
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    if (search) {
      const pattern = '%' + search + '%';
      where[Op.or] = [
        { name: { [Op.like]: pattern } },
        { description: { [Op.like]: pattern } }
      ];
    }
    const menuItems = await db.MenuItem.findAll({
      where,
      include: [{ model: db.Category }],
      order: [['categoryId'], ['name']]
    });
    res.json(menuItems);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await db.MenuItem.findByPk(req.params.id, {
      include: [{ model: db.Category }]
    });
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
    const item = await db.MenuItem.create({ ...req.body, imageUrl });
    const fullItem = await db.MenuItem.findByPk(item.id, { include: [db.Category] });
    res.status(201).json(fullItem);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const item = await db.MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    const updates = { ...req.body };
    if (req.file) updates.imageUrl = '/uploads/' + req.file.filename;
    await item.update(updates);
    const fullItem = await db.MenuItem.findByPk(item.id, { include: [db.Category] });
    res.json(fullItem);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const item = await db.MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found.' });
    await item.destroy();
    res.json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
