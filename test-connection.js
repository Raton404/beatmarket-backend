const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'junction.proxy.rlwy.net',    // Del MYSQL_PUBLIC_URL
    port: 22774,                        // Puerto público
    username: 'root',                   // Del MYSQLUSER
    password: 'xSoHPR1BhKRRJyFBYtGYzHVRsaDvFUvz',  // Del MYSQL_ROOT_PASSWORD
    database: 'railway',                // Del MYSQL_DATABASE
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
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
        console.log('Intentando conectar a la base de datos...');
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente');
        return true;
    } catch (error) {
        console.error('Error de conexión:', error);
        return false;
    }
};

module.exports = { sequelize, testConnection };