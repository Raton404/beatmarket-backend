const express = require('express');
const router = express.Router();
const { createPreference, handleWebhook, checkLicenseAvailability } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas protegidas (requieren autenticación)
router.post('/payment/create-preference', authMiddleware, createPreference);
router.get('/licenses/:licenseId/availability', authMiddleware, checkLicenseAvailability);

// Webhooks (públicos)
router.post('/webhook', handleWebhook);
router.post('/payment/webhook', handleWebhook); // Ruta alternativa para compatibilidad

module.exports = router;
