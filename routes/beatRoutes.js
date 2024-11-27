const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const beatController = require('../controllers/beatController');
const authMiddleware = require('../middlewares/authMiddleware');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'beatFile') {
      cb(null, path.join(__dirname, '../uploads/beats'));
    } else if (file.fieldname === 'coverImage') {
      cb(null, path.join(__dirname, '../uploads/covers'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rutas
router.post('/upload', 
  authMiddleware,
  upload.fields([
    { name: 'beatFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  beatController.uploadBeat
);
router.get('/', beatController.getAllBeats);
router.get('/seller', authMiddleware, beatController.getSellerBeats);
router.get('/:id', beatController.getBeat);
router.put('/:id', authMiddleware, beatController.updateBeat);
router.delete('/:id', authMiddleware, beatController.deleteBeat);
router.get('/:id/stream', beatController.streamBeat);

module.exports = router;