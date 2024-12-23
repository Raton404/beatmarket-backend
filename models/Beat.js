const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');  // Notar la destructuración

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
}, {
  tableName: 'beats',    // Especifica el nombre exacto de la tabla
  timestamps: true       // Si usas timestamps (created_at, updated_at)
});

module.exports = Beat;