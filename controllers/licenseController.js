const { License } = require('../models');

exports.getLicensesForBeat = async (req, res) => {
    try {
        const { beatId } = req.params;
        console.log('Obteniendo licencias para beat:', beatId);

        const licenses = await License.findAll({
            where: { beatId },
            order: [['price', 'ASC']],
            attributes: [
                'id',
                'name',
                'price',
                'maxStreams',
                'isExclusive',
                'commercialUse',
                'sold'
            ]
        });

        res.json(licenses);
    } catch (error) {
        console.error('Error al obtener licencias:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.createLicense = async (req, res) => {
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
};

exports.updateLicense = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await License.update(req.body, {
            where: { id }
        });

        if (updated) {
            const updatedLicense = await License.findByPk(id);
            res.json(updatedLicense);
        } else {
            res.status(404).json({ error: 'Licencia no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar licencia:', error);
        res.status(500).json({ error: error.message });
    }
};