const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool
  }
);

const db = {
  sequelize,
  Sequelize,
  User: require('./User')(sequelize, Sequelize.DataTypes),
  Category: require('./Category')(sequelize, Sequelize.DataTypes),
  MenuItem: require('./MenuItem')(sequelize, Sequelize.DataTypes),
  Table: require('./Table')(sequelize, Sequelize.DataTypes),
  Reservation: require('./Reservation')(sequelize, Sequelize.DataTypes),
  Order: require('./Order')(sequelize, Sequelize.DataTypes),
  OrderItem: require('./OrderItem')(sequelize, Sequelize.DataTypes),
  Feedback: require('./Feedback')(sequelize, Sequelize.DataTypes),
  CartItem: require('./CartItem')(sequelize, Sequelize.DataTypes)
};

// Associations
db.User.hasMany(db.Reservation);
db.Reservation.belongsTo(db.User);

db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

db.User.hasMany(db.Feedback);
db.Feedback.belongsTo(db.User);

db.Category.hasMany(db.MenuItem);
db.MenuItem.belongsTo(db.Category);

db.Table.hasMany(db.Reservation);
db.Reservation.belongsTo(db.Table);

db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

db.MenuItem.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.MenuItem);

db.Order.hasOne(db.Feedback);
db.Feedback.belongsTo(db.Order);

db.User.hasMany(db.CartItem, { foreignKey: 'userId' });
db.CartItem.belongsTo(db.User, { foreignKey: 'userId' });

db.MenuItem.hasMany(db.CartItem, { foreignKey: 'menuItemId' });
db.CartItem.belongsTo(db.MenuItem, { foreignKey: 'menuItemId' });

module.exports = db;
