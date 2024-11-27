const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas (requieren autenticación)
router.get('/me', authMiddleware, authController.me);
router.put('/update', authMiddleware, authController.updateUser);
router.put('/change-password', authMiddleware, authController.changePassword);

// Ruta para verificar si el token es válido
router.get('/verify-token', authMiddleware, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Ruta para cerrar sesión (opcional, ya que normalmente se maneja en el frontend)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Sesión cerrada exitosamente' });
});

module.exports = router;