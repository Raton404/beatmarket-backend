const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // Cambiado de '../config/db' a '../database'

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
}, {
    tableName: 'sellercredentials',
    timestamps: true
});

module.exports = SellerCredentials;