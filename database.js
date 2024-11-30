const Sequelize = require('sequelize');
require('dotenv').config();

// Log de variables de entorno (ocultando datos sensibles)
console.log('Variables de entorno disponibles:', {
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PORT: process.env.DB_PORT,
    NODE_ENV: process.env.NODE_ENV
});

// Configuración de la base de datos
const dbConfig = {
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
    },
    dialectOptions: {
        connectTimeout: 60000,
        // Opciones adicionales para mejorar la estabilidad
        ssl: {
            rejectUnauthorized: false
        }
    }
};

console.log('Configuración de base de datos:', {
    ...dbConfig,
    password: '****' // No mostramos la contraseña en logs
});

const sequelize = new Sequelize(dbConfig);

const testConnection = async () => {
    try {
        console.log('Iniciando prueba de conexión...');
        console.log('Intentando conectar a:', process.env.DB_HOST);
        
        await sequelize.authenticate();
        
        console.log('Conexión establecida correctamente con la base de datos');
        return true;
    } catch (error) {
        console.error('Error detallado de conexión:', {
            name: error.name,
            message: error.message,
            code: error.original?.code,
            sqlState: error.original?.sqlState,
            sqlMessage: error.original?.sqlMessage
        });
        return false;
    }
};

// Manejador de eventos para la conexión
sequelize.addHook('beforeConnect', async (config) => {
    console.log('Intentando establecer conexión con la base de datos...');
});

sequelize.addHook('afterConnect', async () => {
    console.log('Conexión establecida exitosamente');
});

// Exportamos la instancia de Sequelize y la función de prueba
module.exports = { sequelize, testConnection };