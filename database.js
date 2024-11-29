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
  logging: true,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000,
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

// Exporta tanto sequelize como testConnection
module.exports = { sequelize, testConnection };