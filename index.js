const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize, Beat, User, Order, License, SellerCredentials } = require('./models');
const beatRoutes = require('./routes/beatRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

dotenv.config();

const app = express();

app.use(cors({
    origin: ['https://beatmarket-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization']
}));

// Agregar middleware de logging
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    module.exports = app;
    
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware especial para webhooks
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// Middleware regular para el resto de las rutas
app.use(express.json());

// Rutas actualizadas
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/beats', beatRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/seller', sellerRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: err.message });
});

// Sincronizar base de datos y arrancar servidor
sequelize.sync({ alter: true })
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos:', error);
    });

module.exports = app;