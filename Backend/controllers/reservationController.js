const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const db = require('../models');

exports.createReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tableId, reservationDate, reservationTime, guests, specialRequests } = req.body;

    const [timePart] = reservationTime.split('+');
    const timeValue = timePart || reservationTime;

    const existingReservation = await db.Reservation.findOne({
      where: {
        tableId,
        reservationDate,
        reservationTime: timeValue,
        status: { [Op.in]: ['pending', 'confirmed'] }
      }
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Table is not available for the selected time.' });
    }

    const reservation = await db.Reservation.create({
      userId: req.user.id,
      tableId,
      reservationDate,
      reservationTime: timeValue,
      guests: guests || 2,
      specialRequests: specialRequests || null,
      status: 'pending'
    });

    const fullReservation = await db.Reservation.findByPk(reservation.id, {
      include: [{ model: db.Table }]
    });

    res.status(201).json(fullReservation);
  } catch (error) {
    next(error);
  }
};

exports.getMyReservations = async (req, res, next) => {
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

exports.getReservationById = async (req, res, next) => {
  try {
    const reservation = await db.Reservation.findByPk(req.params.id, {
      include: [{ model: db.Table }, { model: db.User, attributes: ['id', 'name', 'email', 'phone'] }]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    if (req.user.role === 'customer' && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reservation = await db.Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    if (req.user.role === 'customer' && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { tableId, reservationDate, reservationTime, guests, specialRequests } = req.body;
    if (tableId) reservation.tableId = tableId;
    if (reservationDate) reservation.reservationDate = reservationDate;
    if (reservationTime) reservation.reservationTime = reservationTime.split('+')[0] || reservationTime;
    if (guests) reservation.guests = guests;
    if (specialRequests !== undefined) reservation.specialRequests = specialRequests;

    await reservation.save();

    const updated = await db.Reservation.findByPk(reservation.id, {
      include: [{ model: db.Table }]
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await db.Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    if (req.user.role === 'customer' && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ message: 'Reservation cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.checkAvailability = async (req, res, next) => {
  try {
    const { reservationDate, reservationTime, guests } = req.query;

    const [timePart] = (reservationTime || '').split('+');
    const timeValue = timePart || reservationTime;

    const bookedTableIds = await db.Reservation.findAll({
      where: {
        reservationDate,
        reservationTime: timeValue,
        status: { [Op.in]: ['pending', 'confirmed'] }
      },
      attributes: ['tableId']
    }).then(r => r.map(x => x.tableId));

    const availableTables = await db.Table.findAll({
      where: {
        id: { [Op.notIn]: bookedTableIds },
        isActive: true,
        capacity: { [Op.gte]: parseInt(guests) || 1 }
      }
    });

    res.json(availableTables);
  } catch (error) {
    next(error);
  }
};

// Admin: Get all reservations
exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await db.Reservation.findAll({
      include: [{ model: db.Table }, { model: db.User, attributes: ['id', 'name', 'email', 'phone'] }],
      order: [['reservationDate', 'DESC'], ['reservationTime', 'DESC']]
    });
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};
