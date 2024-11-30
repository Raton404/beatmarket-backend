const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize } = require('./database');
const { Beat, User, Order, License, SellerCredentials } = require('./models');
const beatRoutes = require('./routes/beatRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const sellerRoutes = require('./routes/sellerRoutes');


dotenv.config();
const app = express();

// Primero los middlewares básicos
app.use(cors({
    origin: ['https://beatmarket-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de logging
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    next();
});

// Middlewares específicos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Función para inicializar la base de datos
const initializeDatabase = async () => {
    try {
        console.log('Intentando conectar a la base de datos con configuración:', {
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER
        });
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente.');
        return true;
    } catch (error) {
        console.error('Error detallado de conexión:', {
            name: error.name,
            message: error.message,
            original: error.original
        });
        throw error;
    }
};

// Middleware para asegurar conexión a la base de datos
app.use(async (req, res, next) => {
    try {
        if (!sequelize.connectionManager.hasOwnProperty('connectionManager')) {
            await initializeDatabase();
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Rutas API
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/beats', beatRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/seller', sellerRoutes);
app.get('/', (req, res) => {
    res.json({ status: 'API is running' });
});

// Manejador de errores mejorado
app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'SequelizeConnectionError' || 
        err.name === 'SequelizeConnectionRefusedError' || 
        err.name === 'AccessDeniedError' ||
        err.name === 'SequelizeConnectionTimedOutError') {
        return res.status(503).json({
            error: 'Database connection error',
            message: err.message,
            type: err.name
        });
    }

    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

// Inicialización del servidor
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
} else {
    // En producción (Vercel)
    initializeDatabase().catch(error => {
        console.error('Error al inicializar la base de datos:', error);
    });
}

module.exports = app;