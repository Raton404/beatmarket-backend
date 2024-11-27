const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UserLibrary = sequelize.define('UserLibrary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    beatId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    licenseId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    downloadCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = UserLibrary;