import { body } from 'express-validator';

const creditCardValidation = [
    body('type')
        .notEmpty()
        .withMessage('El tipo de método de pago es requerido')
        .isIn(['credit_card', 'debit_card', 'card'])
        .withMessage('Tipo de método de pago inválido para tarjeta'),

    body('cardholderName')
        .notEmpty()
        .withMessage('El nombre del titular es requerido')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('El nombre del titular solo puede contener letras y espacios'),

    body('cardNumber')
        .notEmpty()
        .withMessage('El número de tarjeta es requerido')
        .matches(/^[0-9]{16}$/)
        .withMessage('Número de tarjeta inválido'),

    body('expirationMonth')
        .notEmpty()
        .withMessage('El mes de expiración es requerido')
        .matches(/^(0[1-9]|1[0-2])$/)
        .withMessage('Mes de expiración inválido'),

    body('expirationYear')
        .notEmpty()
        .withMessage('El año de expiración es requerido')
        .matches(/^20[2-9][0-9]$/)
        .withMessage('Año de expiración inválido'),

    body('brand')
        .notEmpty()
        .withMessage('La marca de la tarjeta es requerida')
        .isIn(['visa', 'mastercard', 'american_express'])
        .withMessage('Marca de tarjeta inválida'),

    body('isDefault')
        .optional()
        .isBoolean()
        .withMessage('El valor de isDefault debe ser booleano')
];

const paypalValidation = [
    body('type')
        .notEmpty()
        .withMessage('El tipo de método de pago es requerido')
        .equals('paypal')
        .withMessage('Tipo de método de pago inválido para PayPal'),

    body('paypalEmail')
        .notEmpty()
        .withMessage('El correo de PayPal es requerido')
        .isEmail()
        .withMessage('Correo de PayPal inválido'),

    body('isDefault')
        .optional()
        .isBoolean()
        .withMessage('El valor de isDefault debe ser booleano')
];

const validatePaymentMethodUpdate = [
    body('type')
        .optional()
        .isIn(['credit_card', 'debit_card', 'paypal', 'card'])
        .withMessage('Tipo de método de pago inválido'),

    body('cardNumber')
        .optional()
        .matches(/^[0-9]{16}$/)
        .withMessage('Número de tarjeta inválido'),

    body('cardholderName')
        .optional()
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('El nombre del titular solo puede contener letras y espacios'),

    body('expirationMonth')
        .optional()
        .matches(/^(0[1-9]|1[0-2])$/)
        .withMessage('Mes de expiración inválido'),

    body('expirationYear')
        .optional()
        .matches(/^20[2-9][0-9]$/)
        .withMessage('Año de expiración inválido'),

    body('brand')
        .optional()
        .isIn(['visa', 'mastercard', 'american_express'])
        .withMessage('Marca de tarjeta inválida'),

    body('paypalEmail')
        .optional()
        .isEmail()
        .withMessage('Correo de PayPal inválido'),

    body('isDefault')
        .optional()
        .isBoolean()
        .withMessage('El valor de isDefault debe ser booleano')
];

const validatePaymentMethod = (req, res, next) => {
    const { type } = req.body;
    
    // Aplicar el conjunto de validaciones correspondiente
    const validations = type === 'paypal' ? paypalValidation : creditCardValidation;
    
    // Aplicar todas las validaciones antes de llamar a next()
    Promise.all(validations.map(validation => validation.run(req)))
        .then(() => next())
        .catch(error => {
            res.status(400).send({
                success: false,
                msg: 'Error de validación',
                error: error.message
            });
        });
};

export {
    validatePaymentMethod,
    validatePaymentMethodUpdate
};