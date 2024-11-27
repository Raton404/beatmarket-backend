const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Beat = sequelize.define('Beat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  beatPath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coverPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bpm: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Beat;