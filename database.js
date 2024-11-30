const { Sequelize } = require('sequelize');
require('dotenv').config();

// Usar la URL de conexión proporcionada por Railway
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    host: process.env.MYSQL_HOST || 'junction.proxy.rlwy.net',
    database: process.env.MYSQL_DATABASE || 'railway',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'xSoHPRlBhKRRJyFBYtGYzHVRsaDvFUvz',
    port: process.env.MYSQL_PORT || 22774,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    },
    dialectOptions: {
        connectTimeout: 60000
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