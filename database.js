const { Sequelize } = require('sequelize');
require('dotenv').config();

// URL directa de Railway
const connectionString = 'mysql://root:xSoHPR1BhKRRJyFBYtGYzHVRsaDvFUvz@junction.proxy.rlwy.net:22774/railway';

const sequelize = new Sequelize(connectionString, {
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: {
        connectTimeout: 60000,
        // Configuración específica para Railway
        bigNumberStrings: true,
        supportBigNumbers: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente con la base de datos');
        return true;
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        return false;
    }
};

module.exports = { sequelize, testConnection };