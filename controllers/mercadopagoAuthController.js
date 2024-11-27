const { MercadoPagoConfig } = require('mercadopago');
const { SellerCredentials } = require('../models');
const axios = require('axios');

exports.getAuthUrl = (req, res) => {
    try {
        const authUrl = `https://auth.mercadopago.com/authorization?client_id=${process.env.MP_CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${process.env.MP_REDIRECT_URI}`;
        res.json({ authUrl });
    } catch (error) {
        console.error('Error al generar URL de autorización:', error);
        res.status(500).json({ error: 'Error al generar URL de autorización' });
    }
};

exports.handleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        const userId = req.user.id;

        // Intercambiar código por tokens
        const response = await axios.post('https://api.mercadopago.com/oauth/token', {
            client_secret: process.env.MP_ACCESS_TOKEN,
            client_id: process.env.MP_CLIENT_ID,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.MP_REDIRECT_URI
        });

        // Guardar credenciales
        await SellerCredentials.upsert({
            userId,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            merchantId: response.data.user_id,
            expiresAt: new Date(Date.now() + response.data.expires_in * 1000)
        });

        res.redirect('/seller/dashboard?status=connected');
    } catch (error) {
        console.error('Error en callback de MP:', error);
        res.redirect('/seller/dashboard?status=error');
    }
};

exports.getConnectionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const credentials = await SellerCredentials.findOne({
            where: { userId }
        });

        res.json({
            isConnected: !!credentials,
            merchantId: credentials?.merchantId
        });
    } catch (error) {
        console.error('Error al verificar estado de conexión:', error);
        res.status(500).json({ error: 'Error al verificar estado de conexión' });
    }
};