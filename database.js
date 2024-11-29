const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const testConnection = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('Conexión establecida correctamente');
      return true;
    } catch (error) {
      retries -= 1;
      console.log(`Reintento ${5-retries}/5`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  console.error('No se pudo establecer conexión después de 5 intentos');
  return false;
};

module.exports = { sequelize, Sequelize, testConnection };