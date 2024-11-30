const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usar la URL de conexión proporcionada por Railway
const connectionString = process.env.MYSQL_URL || 'mysql://root:xSoHPR1BhKRRJyFBYtGYzHVRsaDvFUvz@junction.proxy.rlwy.net:22774/railway';

const sequelize = new Sequelize(connectionString, {
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
});

const testConnection = async () => {
    try {
        console.log('Intentando conectar a:', connectionString);
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente con la base de datos');
        return true;
    } catch (error) {
        console.error('Error de conexión:', error);
        return false;
    }
};

module.exports = { sequelize, testConnection };