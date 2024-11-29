const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 22774,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  retry: {
    max: 5,
    timeout: 3000
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