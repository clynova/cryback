/**
 * Servicio para integración con WebPay Plus de Transbank
 * Requiere instalar: npm install transbank-sdk
 */
import pkg from 'transbank-sdk';
const { WebpayPlus, Environment } = pkg;

// Función auxiliar para validar URL
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

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
    // Validar los parámetros de entrada
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('El monto debe ser un número positivo');
    }
    
    if (!buyOrder || buyOrder.length > 26) {
      throw new Error(`'buyOrder' es inválido o demasiado largo (máximo 26 caracteres, actual: ${buyOrder ? buyOrder.length : 0})`);
    }
    
    if (!returnUrl || !isValidUrl(returnUrl)) {
      throw new Error(`La URL de retorno '${returnUrl}' no es válida`);
    }
    
    if (!sessionId) {
      throw new Error('El ID de sesión es requerido');
    }

    // Verificar variables de entorno requeridas
    if (!process.env.WEBPAY_COMMERCE_CODE) {
      throw new Error('WEBPAY_COMMERCE_CODE no está configurado en las variables de entorno');
    }
    if (!process.env.WEBPAY_API_KEY) {
      throw new Error('WEBPAY_API_KEY no está configurado en las variables de entorno');
    }
    
    // Configuración según entorno (sandbox o producción)
    const environment = process.env.WEBPAY_ENVIRONMENT === 'production' 
      ? Environment.Production 
      : Environment.Integration;

    const tx = new WebpayPlus.Transaction(
      process.env.WEBPAY_COMMERCE_CODE,
      process.env.WEBPAY_API_KEY,
      environment
    );
    
    console.log('Iniciando transacción WebPay con:', {
      buyOrder,
      sessionId,
      amount,
      returnUrl,
      environment: process.env.WEBPAY_ENVIRONMENT || 'integration'
    });
    
    // Iniciar transacción
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    return response;
  } catch (error) {
    console.error('Error iniciando transacción WebPay:', error);
    if (error.message.includes('Invalid URL')) {
      throw new Error(`URL de retorno inválida: ${returnUrl}. La URL debe ser accesible públicamente y usar HTTPS en producción.`);
    }
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