module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tables', key: 'id' }
    },
    reservationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reservationTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'reservations',
    timestamps: true
  });

  return Reservation;
};
