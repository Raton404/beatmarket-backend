const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para conexión de MercadoPago
router.get('/mp-auth-url', authMiddleware, sellerController.connectMercadoPago);
router.get('/mp-callback', authMiddleware, sellerController.handleMPCallback);
router.get('/mp-status', authMiddleware, sellerController.getConnectionStatus);

// Ruta para estadísticas del vendedor
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        // Aquí implementarías la lógica para obtener las estadísticas
        // Por ahora devolvemos datos de ejemplo
        res.json({
            totalSales: 0,
            totalBeats: 0,
            pendingPayouts: 0
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

module.exports = router;