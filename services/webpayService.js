/**
 * Servicio para integración con WebPay Plus de Transbank
 * Requiere instalar: npm install transbank-sdk
 */
import pkg from 'transbank-sdk';
const { WebpayPlus } = pkg;

/**
 * Inicializa una transacción en WebPay
 * @param {Number} amount - Monto a pagar
 * @param {String} buyOrder - Número de orden de compra
 * @param {String} returnUrl - URL de retorno después del pago
 * @param {String} sessionId - ID de sesión del usuario
 * @returns {Object} Respuesta de WebPay con URL de formulario y token
 */
export const initTransaction = async (amount, buyOrder, returnUrl, sessionId) => {
  try {
    // Configuración según entorno (sandbox o producción)
    const tx = new WebpayPlus.Transaction(
      process.env.WEBPAY_COMMERCE_CODE,
      process.env.WEBPAY_API_KEY,
      process.env.WEBPAY_ENVIRONMENT
    );
    
    // Iniciar transacción
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    return response;
  } catch (error) {
    console.error('Error iniciando transacción WebPay:', error);
    throw error;
  }
};

/**
 * Confirma una transacción WebPay usando el token
 * @param {String} token - Token de la transacción
 * @returns {Object} Resultado de la transacción
 */
export const confirmTransaction = async (token) => {
  try {
    const tx = new WebpayPlus.Transaction(
      process.env.WEBPAY_COMMERCE_CODE,
      process.env.WEBPAY_API_KEY,
      process.env.WEBPAY_ENVIRONMENT
    );
    
    // Confirmar la transacción
    const response = await tx.commit(token);
    return response;
  } catch (error) {
    console.error('Error confirmando transacción WebPay:', error);
    throw error;
  }
};

/**
 * Revierte una transacción en caso de error
 * @param {String} token - Token de la transacción
 * @returns {Object} Resultado de la reversión
 */
export const reverseTransaction = async (token) => {
  try {
    const tx = new WebpayPlus.Transaction(
      process.env.WEBPAY_COMMERCE_CODE,
      process.env.WEBPAY_API_KEY,
      process.env.WEBPAY_ENVIRONMENT
    );
    
    // Reversar la transacción
    const response = await tx.reverse(token);
    return response;
  } catch (error) {
    console.error('Error reversando transacción WebPay:', error);
    throw error;
  }
};

/**
 * Obtiene el estado de una transacción
 * @param {String} token - Token de la transacción
 * @returns {Object} Estado de la transacción
 */
export const getTransactionStatus = async (token) => {
  try {
    const tx = new WebpayPlus.Transaction(
      process.env.WEBPAY_COMMERCE_CODE,
      process.env.WEBPAY_API_KEY,
      process.env.WEBPAY_ENVIRONMENT
    );
    
    // Obtener estado de la transacción
    const response = await tx.status(token);
    return response;
  } catch (error) {
    console.error('Error obteniendo estado de transacción WebPay:', error);
    throw error;
  }
}; 