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
  logging: false, // Desactivamos logging en producción
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Cambiado a false para Railway
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    return false;
  }
};

// Solo ejecutar el test en desarrollo
if (process.env.NODE_ENV !== 'production') {
  testConnection();
}

module.exports = { sequelize, testConnection };