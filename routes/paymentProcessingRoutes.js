import express from 'express';
import { checkAuth } from '../middleware/authMiddleware.js';
import {
    initiatePayment,
    processWebpayReturn,
    processMercadoPagoWebhook,
    getPaymentStatus
} from '../controllers/paymentProcessingController.js';
import { param } from 'express-validator';

const paymentProcessingRoutes = express.Router();

// Validadores
const validateOrderId = [
    param('orderId')
        .isMongoId().withMessage('ID de orden no válido')
];

// Ruta para iniciar proceso de pago
paymentProcessingRoutes.post('/initiate/:orderId', checkAuth, validateOrderId, initiatePayment);

// Ruta para obtener estado de pago
paymentProcessingRoutes.get('/status/:orderId', checkAuth, validateOrderId, getPaymentStatus);

// Rutas para WebPay
paymentProcessingRoutes.post('/webpay/return', processWebpayReturn);

// Rutas para MercadoPago
paymentProcessingRoutes.post('/mercadopago/webhook', processMercadoPagoWebhook);

export { paymentProcessingRoutes }; 