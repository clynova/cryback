import { body } from 'express-validator';

const validateOrder = [
    // Shipping Address Validations
    body('shippingAddress').isObject().withMessage('La dirección de envío debe ser un objeto'),
    body('shippingAddress.street').notEmpty().withMessage('La calle es requerida'),
    body('shippingAddress.city').notEmpty().withMessage('La ciudad es requerida'),
    body('shippingAddress.state').notEmpty().withMessage('El estado es requerido'),
    body('shippingAddress.zipCode').notEmpty().withMessage('El código postal es requerido'),
    body('shippingAddress.country').notEmpty().withMessage('El país es requerido'),

    // Payment Method Validation
    body('paymentMethod')
        .optional()
        .isIn(['credit_card', 'debit_card', 'paypal'])
        .withMessage('Método de pago inválido. Debe ser credit_card, debit_card o paypal'),

    // Shipping Method Validation
    body('shippingMethodId')
        .notEmpty().withMessage('El método de envío es requerido')
        .isMongoId().withMessage('ID de método de envío inválido')
];

export { validateOrder };
