import { body } from 'express-validator';

const validateCreateShippingMethod = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('company')
        .trim()
        .notEmpty().withMessage('La empresa de transporte es requerida')
        .isLength({ min: 2 }).withMessage('El nombre de la empresa debe tener al menos 2 caracteres'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('La descripción no debe exceder los 500 caracteres'),

    body('cost')
        .notEmpty().withMessage('El costo es requerido')
        .isNumeric().withMessage('El costo debe ser un número')
        .custom((value) => {
            if (value < 0) {
                throw new Error('El costo no puede ser negativo');
            }
            return true;
        }),

    body('estimatedDeliveryDays')
        .notEmpty().withMessage('Los días estimados de entrega son requeridos')
        .isInt({ min: 1 }).withMessage('Los días estimados deben ser un número entero mayor a 0')
];

const validateUpdateShippingMethod = [
    body('name')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('company')
        .optional()
        .trim()
        .notEmpty().withMessage('La empresa de transporte no puede estar vacía')
        .isLength({ min: 2 }).withMessage('El nombre de la empresa debe tener al menos 2 caracteres'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('La descripción no debe exceder los 500 caracteres'),

    body('cost')
        .optional()
        .isNumeric().withMessage('El costo debe ser un número')
        .custom((value) => {
            if (value < 0) {
                throw new Error('El costo no puede ser negativo');
            }
            return true;
        }),

    body('estimatedDeliveryDays')
        .optional()
        .isInt({ min: 1 }).withMessage('Los días estimados deben ser un número entero mayor a 0'),

    body('active')
        .optional()
        .isBoolean().withMessage('El campo active debe ser un valor booleano')
];

export { validateCreateShippingMethod, validateUpdateShippingMethod };