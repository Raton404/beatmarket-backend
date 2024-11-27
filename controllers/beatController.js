const path = require('path');
const fs = require('fs');
const { Beat, User, Order, License } = require('../models');

// Upload Beat
exports.uploadBeat = async (req, res) => {
  try {
    console.log('=== Inicio de subida ===');
    console.log('Usuario:', req.user);
    console.log('Archivos recibidos:', req.files);
    console.log('Datos recibidos:', req.body);

    if (!req.files || !req.files.beatFile) {
      console.log('Error: No se encontró el archivo de beat');
      return res.status(400).json({ error: 'No se proporcionó archivo de beat' });
    }

    const beatFile = req.files.beatFile[0];
    console.log('Archivo de beat:', beatFile.path);
    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;

    const beatsDir = path.join(__dirname, '../uploads/beats');
    const coversDir = path.join(__dirname, '../uploads/covers');

    if (!fs.existsSync(beatsDir)) {
      console.log('Creando directorio de beats');
      fs.mkdirSync(beatsDir, { recursive: true });
    }

    if (!fs.existsSync(coversDir)) {
      console.log('Creando directorio de covers');
      fs.mkdirSync(coversDir, { recursive: true });
    }

    if (beatFile.size > 50 * 1024 * 1024) {
      console.log('Error: Archivo demasiado grande');
      return res.status(400).json({
        error: 'El archivo de beat es demasiado grande. Máximo 50MB permitido.'
      });
    }

    if (!req.body.title || !req.body.genre) {
      console.log('Error: Faltan campos requeridos');
      return res.status(400).json({
        error: 'Se requieren título y género'
      });
    }

    const beatData = {
      title: req.body.title,
      genre: req.body.genre,
      description: req.body.description || '',
      duration: req.body.duration || '',
      bpm: Number(req.body.bpm) || null,
      key: req.body.key || null,
      beatPath: beatFile.path,
      coverPath: coverImage ? coverImage.path : null,
      sellerId: req.user.id
    };

    console.log('Datos a guardar en la base de datos:', beatData);

    const beat = await Beat.create(beatData);
    console.log('Beat guardado exitosamente con ID:', beat.id);

    const response = {
      success: true,
      message: 'Beat subido exitosamente',
      beat: {
        id: beat.id,
        title: beat.title,
        genre: beat.genre,
        description: beat.description,
        duration: beat.duration,
        bpm: beat.bpm,
        key: beat.key,
        beatUrl: `/uploads/beats/${path.basename(beatFile.path)}`,
        coverUrl: coverImage ? `/uploads/covers/${path.basename(coverImage.path)}` : null
      }
    };

    console.log('Enviando respuesta exitosa:', response);
    res.status(201).json(response);

  } catch (error) {
    console.error('=== Error al subir beat ===');
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        details: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

// Get All Beats
exports.getAllBeats = async (req, res) => {
  try {
    console.log('Obteniendo beats...');
    const beats = await Beat.findAll({
      order: [['createdAt', 'DESC']],
      attributes: [
        'id', 
        'title', 
        'genre', 
        'duration', 
        'beatPath',
        'coverPath',
        'sellerId',
        'bpm',
        'key',
        'description'
      ],
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name']
        },
        {
          model: License,
          as: 'licenses'
        }
      ]
    });

    const transformedBeats = beats.map(beat => {
      if (!beat.beatPath) {
        console.log('Warning: Beat sin beatPath:', beat.id);
        return null;
      }

      return {
        id: beat.id,
        title: beat.title,
        genre: beat.genre,
        duration: beat.duration,
        bpm: beat.bpm,
        key: beat.key,
        description: beat.description,
        sellerId: beat.sellerId,
        sellerName: beat.seller ? beat.seller.name : 'Unknown',
        licenses: beat.licenses || [],
        beatUrl: `/uploads/beats/${path.basename(beat.beatPath)}`,
        coverUrl: beat.coverPath ? `/uploads/covers/${path.basename(beat.coverPath)}` : null
      };
    }).filter(beat => beat !== null);

    console.log('Beats transformados:', transformedBeats); // Para debugging
    res.json(transformedBeats);
  } catch (error) {
    console.error('Error al obtener beats:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Seller Beats
exports.getSellerBeats = async (req, res) => {
  try {
    console.log('Buscando beats del vendedor:', req.user.id);
    
    const beats = await Beat.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: License,
          as: 'licenses'
        }
      ]
    });

    const transformedBeats = beats.map(beat => ({
      ...beat.toJSON(),
      beatUrl: `/uploads/beats/${path.basename(beat.beatPath)}`,
      coverUrl: beat.coverPath ? `/uploads/covers/${path.basename(beat.coverPath)}` : null
    }));

    console.log(`Encontrados ${beats.length} beats`);
    res.json(transformedBeats);
  } catch (error) {
    console.error('Error al obtener beats:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Single Beat
exports.getBeat = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Buscando beat con ID:', id);
    
    const beat = await Beat.findByPk(id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name']
        },
        {
          model: License,
          as: 'licenses'
        }
      ]
    });
    
    if (!beat) {
      console.log('Beat no encontrado');
      return res.status(404).json({ error: 'Beat no encontrado' });
    }

    // Transformar los datos para incluir las URLs y toda la información necesaria
    const beatData = {
      id: beat.id,
      title: beat.title,
      genre: beat.genre,
      bpm: beat.bpm,
      key: beat.key,
      description: beat.description,
      duration: beat.duration,
      sellerId: beat.sellerId,
      sellerName: beat.seller?.name,
      licenses: beat.licenses || [], // Incluimos las licencias
      beatUrl: `/uploads/beats/${path.basename(beat.beatPath)}`,
      coverUrl: beat.coverPath ? `/uploads/covers/${path.basename(beat.coverPath)}` : null
    };

    console.log('Beat encontrado:', beat.id);
    res.json(beatData);
  } catch (error) {
    console.error('Error al obtener beat:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update Beat
exports.updateBeat = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Actualizando beat:', id);
    console.log('Datos de actualización:', req.body);

    const beat = await Beat.findOne({
      where: { id, sellerId: req.user.id }
    });

    if (!beat) {
      console.log('Beat no encontrado');
      return res.status(404).json({ error: 'Beat no encontrado' });
    }

    await beat.update(req.body);
    
    const updatedBeat = {
      ...beat.toJSON(),
      beatUrl: `/uploads/beats/${path.basename(beat.beatPath)}`,
      coverUrl: beat.coverPath ? `/uploads/covers/${path.basename(beat.coverPath)}` : null
    };

    console.log('Beat actualizado exitosamente');
    res.json(updatedBeat);
  } catch (error) {
    console.error('Error al actualizar beat:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Beat
exports.deleteBeat = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Eliminando beat:', id);

    const beat = await Beat.findOne({
      where: { id, sellerId: req.user.id }
    });

    if (!beat) {
      console.log('Beat no encontrado');
      return res.status(404).json({ error: 'Beat no encontrado' });
    }

    if (beat.beatPath && fs.existsSync(beat.beatPath)) {
      console.log('Eliminando archivo de beat:', beat.beatPath);
      fs.unlinkSync(beat.beatPath);
    }
    if (beat.coverPath && fs.existsSync(beat.coverPath)) {
      console.log('Eliminando imagen de portada:', beat.coverPath);
      fs.unlinkSync(beat.coverPath);
    }

    await beat.destroy();
    console.log('Beat eliminado exitosamente');
    res.json({ message: 'Beat eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar beat:', error);
    res.status(500).json({ error: error.message });
  }
};

// Stream Beat
exports.streamBeat = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Streaming beat:', id);

    const beat = await Beat.findByPk(id);

    if (!beat || !beat.beatPath) {
      console.log('Beat no encontrado');
      return res.status(404).json({ error: 'Beat no encontrado' });
    }

    const stat = fs.statSync(beat.beatPath);
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const stream = fs.createReadStream(beat.beatPath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg'
      });
      
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': 'audio/mpeg'
      });
      fs.createReadStream(beat.beatPath).pipe(res);
    }
  } catch (error) {
    console.error('Error al reproducir beat:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
