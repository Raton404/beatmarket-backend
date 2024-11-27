const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario
    const user = await User.findOne({ 
      where: { id: decoded.userId },
      attributes: ['id', 'name', 'email', 'role'] // Solo seleccionar campos necesarios
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Añadir el usuario a la request
    req.user = user;
    
    // Verificar si el token está por expirar y generar uno nuevo si es necesario
    const tokenExp = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Si el token expira en menos de 1 hora, generar uno nuevo
    if (tokenExp - currentTime < 3600) {
      const newToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.setHeader('New-Token', newToken);
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;