const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true
    }
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to database.');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

testConnection();

module.exports = sequelize;