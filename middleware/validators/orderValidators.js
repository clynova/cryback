import { body, param } from 'express-validator';

const validateOrder =
    [
        body('shippingAddress')
            .notEmpty().withMessage('La dirección de envío es requerida'),
        body('paymentMethod')
            .notEmpty().withMessage('El método de pago es requerido')
            .isIn(['card', 'paypal', 'bank_transfer']).withMessage('El método de pago no es válido'),
    ];

export { validateOrder };
