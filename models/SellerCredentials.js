const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SellerCredentials = sequelize.define('SellerCredentials', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicKey: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expiresIn: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
});

module.exports = SellerCredentials;