const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const { License } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/beats/:beatId/licenses', async (req, res) => {
    try {
        const { beatId } = req.params;
        const licenses = await License.findAll({
            where: { beatId },
            order: [['price', 'ASC']]
        });
        res.json(licenses);
    } catch (error) {
        console.error('Error al obtener licencias:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rutas protegidas
router.post('/beats/:beatId/licenses', authMiddleware, async (req, res) => {
    try {
        const { beatId } = req.params;
        const licenseData = {
            ...req.body,
            beatId
        };
        const license = await License.create(licenseData);
        res.status(201).json(license);
    } catch (error) {
        console.error('Error al crear licencia:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/licenses/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await License.update(req.body, {
            where: { id }
        });
        if (updated) {
            const updatedLicense = await License.findByPk(id);
            res.json(updatedLicense);
        } else {
            res.status(404).json({ message: 'Licencia no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar licencia:', error);
        res.status(500).json({ error: error.message });
    }
});

// Nueva ruta para eliminar licencia
router.delete('/licenses/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await License.destroy({
            where: { id }
        });
        if (deleted) {
            res.json({ message: 'Licencia eliminada' });
        } else {
            res.status(404).json({ message: 'Licencia no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar licencia:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mantener las rutas originales del controlador por compatibilidad
router.get('/beats/:beatId/licenses', licenseController.getLicensesForBeat);
router.post('/beats/:beatId/licenses', authMiddleware, licenseController.createLicense);
router.put('/licenses/:id', authMiddleware, licenseController.updateLicense);

module.exports = router;
