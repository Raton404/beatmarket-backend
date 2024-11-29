const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // Aquí hacemos destructuring para obtener solo sequelize

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('buyer', 'seller'),
    defaultValue: 'buyer'
  },
  mercadoPagoAccessToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = User;