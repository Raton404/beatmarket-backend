const { UserLibrary, Beat, License, Order } = require('../models');

exports.getUserLibrary = async (req, res) => {
    try {
        const userId = req.user.id;

        const library = await UserLibrary.findAll({
            where: { userId },
            include: [
                {
                    model: Beat,
                    attributes: ['id', 'title', 'beatPath', 'coverPath']
                },
                {
                    model: License,
                    attributes: ['id', 'name', 'isExclusive']
                },
                {
                    model: Order,
                    attributes: ['id', 'status', 'createdAt']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const transformedLibrary = library.map(item => ({
            id: item.id,
            beatId: item.beatId,
            beatTitle: item.Beat.title,
            beatUrl: `/uploads/beats/${path.basename(item.Beat.beatPath)}`,
            coverUrl: item.Beat.coverPath ? `/uploads/covers/${path.basename(item.Beat.coverPath)}` : null,
            licenseName: item.License.name,
            isExclusive: item.License.isExclusive,
            purchaseDate: item.Order.createdAt,
            downloadCount: item.downloadCount
        }));

        res.json(transformedLibrary);
    } catch (error) {
        console.error('Error al obtener biblioteca:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.downloadBeat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { beatId, licenseId } = req.params;

        const libraryItem = await UserLibrary.findOne({
            where: { userId, beatId, licenseId },
            include: [{ model: Beat }]
        });

        if (!libraryItem) {
            return res.status(404).json({ error: 'Beat no encontrado en tu biblioteca' });
        }

        // Incrementar contador de descargas
        libraryItem.downloadCount += 1;
        await libraryItem.save();

        // Enviar el archivo
        res.download(libraryItem.Beat.beatPath);
    } catch (error) {
        console.error('Error al descargar beat:', error);
        res.status(500).json({ error: error.message });
    }
};