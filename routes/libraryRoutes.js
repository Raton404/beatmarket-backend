const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/library', authMiddleware, libraryController.getUserLibrary);
router.get('/library/download/:beatId/:licenseId', authMiddleware, libraryController.downloadBeat);

module.exports = router;