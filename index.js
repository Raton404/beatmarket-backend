const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Añadir esta importación
const { sequelize } = require('./models');
const beatRoutes = require('./routes/beatRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
// Eliminar esta línea: const webhookRoutes = require('./routes/webhookRoutes');

dotenv.config();

const app = express();

app.use(cors({
    origin: ['https://beatmarket-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware especial para webhooks
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// Middleware regular para el resto de las rutas
app.use(express.json());

// Rutas actualizadas
app.use('/api/payment', paymentRoutes);  // Cambiado de '/api' a '/api/payment'
app.use('/api/auth', authRoutes);        // Esta está bien
app.use('/api/beats', beatRoutes);       // Esta está bien
app.use('/api/licenses', licenseRoutes); // Cambiado de '/api' a '/api/licenses'
app.use('/api/seller', sellerRoutes);
// Eliminar esta línea: app.use('/api', webhookRoutes);

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