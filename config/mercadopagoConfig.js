const { MercadoPagoConfig, Preference } = require('mercadopago');

// Verificar que estamos usando el token correcto
console.log('Ambiente:', process.env.MP_ACCESS_TOKEN.startsWith('APP_USR-') ? 'Producción' : 'Sandbox');

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});

// Función para validar la firma del webhook (importante en producción)
const validateWebhookSignature = (signature, data) => {
    if (!signature) return false;

    try {
        const crypto = require('crypto');
        const hash = crypto
            .createHmac('sha256', process.env.WEBHOOK_SECRET)
            .update(JSON.stringify(data))
            .digest('hex');

        return hash === signature;
    } catch (error) {
        console.error('Error validando firma del webhook:', error);
        return false;
    }
};

module.exports = {
    client,
    Preference,
    validateWebhookSignature
};