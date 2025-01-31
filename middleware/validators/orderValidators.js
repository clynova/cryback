import { body, param } from 'express-validator';

const validateOrder = () => {
    
    return [
        body('shippingAddress')
            .notEmpty().withMessage('La dirección de envío es requerida')
            .isString().withMessage('La dirección de envío debe ser un texto')
            .trim()
            .isLength({ min: 3, max: 100 }).withMessage('La dirección de envío debe tener entre 3 y 100 caracteres'),
        body('paymentMethod')
            .notEmpty().withMessage('El método de pago es requerido')
            .isIn(['card', 'paypal', 'bank_transfer']).withMessage('El método de pago no es válido'),
    ];
}   

export { validateOrder };
