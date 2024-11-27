const { MercadoPagoConfig, Preference } = require('mercadopago');
const { Beat, User, Order, License, SellerCredentials } = require('../models');
const { mercadopago, validateWebhookSignature } = require('../config/mercadopagoConfig');

// Configurar MercadoPago con un cliente global
const globalClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// Elimina los "exports." del inicio de cada función
const createPreference = async (req, res) => {
    try {
        // Logging para producción
        console.log('Iniciando creación de preferencia:', {
            timestamp: new Date().toISOString(),
            buyerId: req.body.buyerId,
            licenseId: req.body.licenseId
        });

        const { title, sellerId, licenseId, buyerId } = req.body;

        // Validar datos requeridos
        if (!title || !licenseId) {
            return res.status(400).json({
                error: 'Faltan datos requeridos',
                details: 'El título y la licencia son obligatorios'
            });
        }

        // Obtener licencia y credenciales del vendedor si hay vendedor
        const [license, sellerCredentials] = await Promise.all([
            License.findByPk(licenseId),
            sellerId ? SellerCredentials.findOne({ where: { userId: sellerId } }) : null
        ]);

        if (!license) {
            return res.status(404).json({
                error: 'Licencia no encontrada',
                details: 'La licencia especificada no existe'
            });
        }

        if (sellerId && !sellerCredentials) {
            return res.status(400).json({
                error: 'El vendedor necesita conectar su cuenta de MercadoPago'
            });
        }

        // Convertir y validar el precio
        const unitPrice = Number(license.price);
        if (isNaN(unitPrice) || unitPrice <= 0) {
            return res.status(400).json({
                error: 'Precio inválido',
                details: 'El precio debe ser un número positivo'
            });
        }

        const platformFee = unitPrice * 0.10; // Comisión del 10%

        const preferenceData = {
            items: [
                {
                    title: `${title} - ${license.name}`,
                    quantity: 1,
                    currency_id: 'CLP',
                    unit_price: unitPrice,
                    description: `Licencia ${license.name} - ${license.isExclusive ? 'Exclusiva' : 'No exclusiva'}`
                }
            ],
            back_urls: {
                success: `${process.env.FRONTEND_URL}/success`,
                failure: `${process.env.FRONTEND_URL}/failure`,
                pending: `${process.env.FRONTEND_URL}/pending`
            },
            auto_return: "approved",
            binary_mode: true,
            notification_url: process.env.WEBHOOK_URL,
            payment_methods: {
                installments: 1,
                default_installments: 1,
                excluded_payment_methods: [],
                excluded_payment_types: []
            },
            marketplace_fee: platformFee,
            external_reference: JSON.stringify({
                beatId: license.beatId,
                licenseId: license.id,
                sellerId,
                buyerId
            }),
            statement_descriptor: "CHILEBEATS"
        };

        // Crear cliente de Mercado Pago con credenciales del vendedor si existen
        const client = sellerCredentials
            ? new MercadoPagoConfig({ accessToken: sellerCredentials.accessToken })
            : globalClient;

        const preference = new Preference(client);
        const result = await preference.create({ body: preferenceData });

        // Crear orden pendiente en la base de datos
        await Order.create({
            beatId: license.beatId,
            licenseId: license.id,
            buyerId,
            sellerId,
            amount: unitPrice,
            platformFee,
            status: 'pending',
            preferenceId: result.id,
            licenseType: license.name,
            licenseTerms: license.termsAndConditions || 'Términos estándar de la licencia'
        });

        // Logging de éxito
        console.log('Preferencia creada exitosamente:', {
            preferenceId: result.id,
            timestamp: new Date().toISOString()
        });

        // Enviar respuesta al cliente
        res.json({
            id: result.id,
            init_point: result.init_point
        });

    } catch (error) {
        // Logging detallado de errores en producción
        console.error('Error en createPreference:', {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            data: {
                buyerId: req.body.buyerId,
                licenseId: req.body.licenseId
            }
        });

        console.error('Error al crear preferencia:', error);
        res.status(500).json({
            error: true,
            message: 'Error al procesar el pago. Por favor, intente nuevamente.'
        });
    }
};

const handleWebhook = async (req, res) => {
    try {
        // Parsear el body que viene como Buffer
        const rawBody = req.body;
        const bodyStr = rawBody instanceof Buffer ? rawBody.toString('utf8') : JSON.stringify(rawBody);
        const webhookData = JSON.parse(bodyStr);

        console.log('Webhook data parseada:', webhookData);

        // Verificar si es una notificación de prueba
        if (webhookData.action === "test.created") {
            console.log('Notificación de prueba recibida correctamente');
            return res.status(200).send('OK');
        }

        // Para notificaciones reales de pago
        if (webhookData.action === "payment.created" || webhookData.action === "payment.updated") {
            const paymentId = webhookData.data.id;
            
            console.log('Procesando pago:', paymentId);

            // Obtener detalles del pago
            const payment = await mercadopago.payment.findById(paymentId);
            console.log('Detalles del pago:', payment);

            if (payment.status === 'approved') {
                // Procesar el pago aprobado
                // ... tu lógica de procesamiento ...
            }
        }

        res.status(200).send('OK');

    } catch (error) {
        console.error('Error procesando webhook:', {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack
        });
        // Siempre responder 200 para evitar reintentos
        res.status(200).send('OK');
    }
};

const checkLicenseAvailability = async (req, res) => {
    try {
        const { licenseId } = req.params;
        const license = await License.findByPk(licenseId);

        if (!license) {
            return res.status(404).json({
                available: false,
                message: 'Licencia no encontrada'
            });
        }

        const available = !license.isExclusive || !license.sold;
        res.json({
            available,
            message: available ? 'Licencia disponible' : 'Esta licencia exclusiva ya ha sido vendida'
        });
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        res.status(500).json({ error: error.message });
    }
};

// Una única exportación al final
module.exports = {
    createPreference,
    handleWebhook,
    checkLicenseAvailability
};
