const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Seller = sequelize.define('Seller', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mercadoPagoUserId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Seller;