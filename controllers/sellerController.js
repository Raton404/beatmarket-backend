const { MercadoPagoConfig } = require('mercadopago');
const { SellerCredentials } = require('../models');

// Configuración del cliente de MP
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// Definir las funciones
const getConnectionStatus = async (req, res) => {
    try {
        const credentials = await SellerCredentials.findOne({
            where: { userId: req.user.id }
        });
        
        res.json({
            isConnected: !!credentials && credentials.status === 'active'
        });
    } catch (error) {
        console.error('Error al verificar estado de conexión:', error);
        res.status(500).json({ error: 'Error al verificar conexión' });
    }
};

const connectMercadoPago = async (req, res) => {
    try {
        const authURL = `https://auth.mercadopago.com/authorization?client_id=${process.env.MP_CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(process.env.MP_REDIRECT_URI)}`;
        
        console.log('URL de autorización:', authURL);
        res.json({ authUrl: authURL });
    } catch (error) {
        console.error('Error en connectMercadoPago:', error);
        res.status(500).json({ error: 'Error al iniciar la conexión con MercadoPago' });
    }
};

const handleMPCallback = async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            throw new Error('No se recibió el código de autorización');
        }

        // Intercambiar el código por el token de acceso
        const response = await fetch('https://api.mercadopago.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_secret: process.env.MP_CLIENT_SECRET,
                client_id: process.env.MP_CLIENT_ID,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.MP_REDIRECT_URI
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error en respuesta de MP:', data);
            throw new Error('Error al obtener el token de acceso');
        }

        // Guardar las credenciales del vendedor
        await SellerCredentials.create({
            userId: req.user.id,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            publicKey: data.public_key,
            expiresIn: data.expires_in,
            status: 'active'
        });

        // Redirigir al dashboard con mensaje de éxito
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?status=success`);

    } catch (error) {
        console.error('Error en handleMPCallback:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?status=error`);
    }
};

// Exportar todas las funciones juntas
module.exports = {
    getConnectionStatus,
    connectMercadoPago,
    handleMPCallback
};