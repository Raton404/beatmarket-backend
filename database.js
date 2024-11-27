const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

db.connect(error => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Successfully connected to database.');
});

module.exports = db;