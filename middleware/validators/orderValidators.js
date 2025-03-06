import { body } from 'express-validator';

const validateOrder = [
    // Shipping Address Validations
    body('shippingAddress').isObject().withMessage('La dirección de envío debe ser un objeto'),
    body('shippingAddress.street').notEmpty().withMessage('La calle es requerida'),
    body('shippingAddress.city').notEmpty().withMessage('La ciudad es requerida'),
    body('shippingAddress.state').notEmpty().withMessage('El estado es requerido'),
    body('shippingAddress.zipCode').notEmpty().withMessage('El código postal es requerido'),
    body('shippingAddress.country').notEmpty().withMessage('El país es requerido'),
    body('shippingAddress.recipientName').notEmpty().withMessage('El nombre del destinatario es requerido'),
    body('shippingAddress.reference').optional().isString().withMessage('La referencia debe ser un texto'),
    body('shippingAddress.phoneContact').optional().isString().withMessage('El teléfono de contacto debe ser un texto'),
    body('shippingAddress.additionalInstructions').optional().isString().withMessage('Las instrucciones adicionales deben ser un texto'),
    
    // Payment Method Validation
    body('paymentMethod')
        .notEmpty().withMessage('El método de pago es requerido')
        .isMongoId().withMessage('El ID del método de pago debe ser un ID de MongoDB válido'),
    
    // Nueva estructura de envío
    body('shipping').isObject().withMessage('La información de envío debe ser un objeto'),
    body('shipping.carrier')
        .notEmpty().withMessage('El transportista es requerido')
        .isMongoId().withMessage('ID del transportista inválido'),
    body('shipping.method')
        .notEmpty().withMessage('El método de envío específico es requerido'),
    body('shipping.cost')
        .notEmpty().withMessage('El costo de envío es requerido')
        .isNumeric().withMessage('El costo de envío debe ser un número')
        .custom(value => {
            if (value < 0) throw new Error('El costo de envío no puede ser negativo');
            return true;
        })
];

export { validateOrder };
