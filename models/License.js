const { DataTypes } = require('sequelize');
const { sequelize } = require('../database'); // Añadimos las llaves {}

const License = sequelize.define('License', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    beatId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxStreams: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isExclusive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    commercialUse: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    sold: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    termsAndConditions: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Términos estándar de la licencia'
    }
});

module.exports = License;