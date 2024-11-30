const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
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