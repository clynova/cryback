import { Order } from '../models/Order.js';
import { PaymentMethod } from '../models/PaymentMethod.js';
import { validationResult } from 'express-validator';
import * as webpayService from '../services/webpayService.js';
import * as mercadoPagoService from '../services/mercadoPagoService.js';
import { OrderDetail } from '../models/OrderDetail.js';
import { Product } from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Inicia el proceso de pago para una orden
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const initiatePayment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const { orderId } = req.params;
        
        // Buscar la orden y verificar que exista
        const order = await Order.findById(orderId).populate('paymentMethod');
        if (!order) {
            return res.status(404).json({ success: false, msg: "Orden no encontrada" });
        }
        
        // Verificar que la orden pertenezca al usuario actual
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: "No tienes permiso para acceder a esta orden" });
        }
        
        // Verificar que la orden esté pendiente de pago
        if (order.payment.status !== 'pending') {
            return res.status(400).json({ success: false, msg: "Esta orden ya ha sido procesada" });
        }
        
        // Obtener el método de pago
        const paymentMethod = await PaymentMethod.findById(order.paymentMethod);
        if (!paymentMethod || !paymentMethod.active) {
            return res.status(400).json({ success: false, msg: "Método de pago no válido" });
        }
        
        // Iniciar el proceso según el tipo de pago
        let paymentResponse;


        console.log(order);
        
        if (paymentMethod.type === 'webpay') {
            try {
                // Iniciar transacción con WebPay
                // Crear un identificador más corto para respetar el límite de 26 caracteres
                const orderId = order._id.toString();
                // Usar solo los últimos 12 caracteres para estar seguro de no exceder el límite
                const shortOrderId = orderId.substring(orderId.length - 12); 
                const buyOrder = `OC${shortOrderId}`;
                
                // Asegurarnos de que el buyOrder no exceda los 26 caracteres
                console.log(`Longitud de buyOrder: ${buyOrder.length}, valor: ${buyOrder}`);
                
                const sessionId = req.sessionID || req.user._id.toString();
                
                // Construir URL de retorno
                let returnUrl;
                if (process.env.NODE_ENV === 'production') {
                    // En producción, usar HTTPS
                    returnUrl = `https://${process.env.BACKEND_URL}/api/payments/webpay/return`;
                } else {
                    // En desarrollo, usar ngrok o una URL pública similar
                    // Si no hay URL configurada, usar localhost como fallback
                    returnUrl = process.env.WEBPAY_RETURN_URL || 'https://cryback.onrender.com/';
                }

                // Validar que la URL no sea localhost en producción
                if (process.env.NODE_ENV === 'production' && returnUrl.includes('localhost')) {
                    throw new Error('No se puede usar localhost en producción para WebPay');
                }

                console.log('URL de retorno WebPay:', returnUrl);

                paymentResponse = await webpayService.initTransaction(
                    order.total,
                    buyOrder,
                    returnUrl,
                    sessionId
                );
                
                // Actualizar orden con detalles iniciales de pago
                order.payment.provider = 'webpay';
                order.payment.status = 'processing';
                await order.save();
                
                return res.json({
                    success: true,
                    redirectUrl: paymentResponse.url,
                    token: paymentResponse.token,
                    payment_type: 'webpay'
                });
            } catch (error) {
                console.error('Error iniciando transacción WebPay:', error);
                return res.status(500).json({ 
                    success: false, 
                    msg: "Error al iniciar transacción con WebPay", 
                    error: error.message 
                });
            }
            
        } else if (paymentMethod.type === 'mercadopago') {
            // Obtener los detalles de los productos en la orden
            const orderDetails = await OrderDetail.find({ orderId: order._id }).populate('productId');
            
            // Formatear items para MercadoPago
            const items = await Promise.all(orderDetails.map(async (detail) => {
                const product = await Product.findById(detail.productId);
                return {
                    name: product.name,
                    price: detail.unitPrice,
                    quantity: detail.quantity,
                };
            }));
            
            // Datos del pagador
            const user = req.user;
            const payer = {
                name: user.firstName + ' ' + user.lastName,
                email: user.email,
            };
            
            // Iniciar transacción con MercadoPago
            paymentResponse = await mercadoPagoService.createPayment(
                { id: order._id.toString() },
                items,
                payer
            );
            
            // Actualizar orden con detalles iniciales de pago
            order.payment.provider = 'mercadopago';
            order.payment.status = 'processing';
            await order.save();
            
            return res.json({
                success: true,
                redirectUrl: paymentResponse.body.init_point,
                preference_id: paymentResponse.body.id,
                payment_type: 'mercadopago'
            });
            
        } else {
            return res.status(400).json({ success: false, msg: "Método de pago no soportado" });
        }
        
    } catch (error) {
        console.error('Error iniciando proceso de pago:', error);
        res.status(500).json({ success: false, msg: "Error en el servidor al procesar el pago" });
    }
};

/**
 * Procesa la respuesta de WebPay después del pago
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const processWebpayReturn = async (req, res) => {
    try {
        const { token_ws } = req.body;
        
        if (!token_ws) {
            return res.redirect(`${process.env.FRONTEND_URL}/checkout/failure?reason=rejected`);
        }
        
        // Confirmar la transacción con WebPay
        const paymentResult = await webpayService.confirmTransaction(token_ws);
        
        // Extraer el orderId de la respuesta (ahora usando el formato modificado)
        // El formato es OC + últimos 20 caracteres del ObjectId
        let buyOrder = paymentResult.buy_order;
        
        // Buscar la orden - primero intentamos encontrar por el prefijo exacto
        let order = null;
        
        if (buyOrder.startsWith('OC')) {
            // Extraer el ID corto (los últimos 20 caracteres)
            const shortOrderId = buyOrder.substring(2);
            
            // Buscar todas las órdenes que podrían coincidir
            const possibleOrders = await Order.find({
                status: 'pending',
                'payment.status': 'processing',
                'payment.provider': 'webpay'
            });
            
            // Encontrar la orden que coincide con el shortOrderId
            order = possibleOrders.find(o => 
                o._id.toString().endsWith(shortOrderId)
            );
        }
        
        if (!order) {
            return res.redirect(`${process.env.FRONTEND_URL}/checkout/failure?reason=order_not_found`);
        }
        
        // Actualizar el estado según la respuesta
        if (paymentResult.response_code === 0) {
            // Pago aprobado
            order.payment.status = 'completed';
            order.payment.transactionId = paymentResult.transaction_id;
            order.payment.paymentDetails = paymentResult;
            order.payment.paymentDate = new Date();
            await order.save();
            
            return res.redirect(`${process.env.FRONTEND_URL}/checkout/success?order_id=${order._id}`);
        } else {
            // Pago rechazado
            order.payment.status = 'failed';
            order.payment.paymentDetails = paymentResult;
            await order.save();
            
            return res.redirect(`${process.env.FRONTEND_URL}/checkout/failure?reason=rejected&order_id=${order._id}`);
        }
        
    } catch (error) {
        console.error('Error procesando retorno de WebPay:', error);
        res.redirect(`${process.env.FRONTEND_URL}/checkout/failure?reason=error`);
    }
};

/**
 * Procesa el webhook de MercadoPago
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const processMercadoPagoWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        
        // Procesar notificación
        const paymentData = await mercadoPagoService.processWebhook(webhookData);
        
        if (paymentData) {
            // Extraer el orderId
            const orderId = paymentData.external_reference;
            
            // Buscar la orden
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
            
            // Actualizar estado de la orden según estado del pago
            switch (paymentData.status) {
                case 'approved':
                    order.payment.status = 'completed';
                    order.payment.transactionId = paymentData.paymentId;
                    order.payment.paymentDetails = paymentData;
                    order.payment.paymentDate = new Date();
                    break;
                
                case 'pending':
                case 'in_process':
                    order.payment.status = 'processing';
                    order.payment.paymentDetails = paymentData;
                    break;
                
                case 'rejected':
                case 'cancelled':
                case 'refunded':
                    order.payment.status = 'failed';
                    order.payment.paymentDetails = paymentData;
                    break;
            }
            
            await order.save();
        }
        
        // Siempre responder 200 al webhook
        return res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('Error procesando webhook de MercadoPago:', error);
        res.status(500).json({ error: 'Error procesando la notificación' });
    }
};

/**
 * Obtiene el estado de un pago
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Buscar la orden
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, msg: "Orden no encontrada" });
        }
        
        // Verificar que la orden pertenezca al usuario actual
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: "No tienes permiso para acceder a esta orden" });
        }
        
        return res.json({
            success: true,
            paymentStatus: order.payment.status,
            provider: order.payment.provider,
            transactionId: order.payment.transactionId,
            paymentDate: order.payment.paymentDate
        });
        
    } catch (error) {
        console.error('Error obteniendo estado del pago:', error);
        res.status(500).json({ success: false, msg: "Error en el servidor" });
    }
}; 