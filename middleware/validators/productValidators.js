import { body, param } from 'express-validator';

const validateProductRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre del producto es requerido')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    body('description')
        .trim()
        .notEmpty().withMessage('La descripción es requerida')
        .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),

    body('price')
        .notEmpty().withMessage('El precio es requerido')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),

    body('images')
        .optional()
        .isArray().withMessage('Las imágenes deben ser un array')
        .custom((images) => {
            if (!images.every(img => /\.(jpg|jpeg|png|webp|gif)$/.test(img))) {
                throw new Error('Cada imagen debe tener un formato válido (JPG, PNG, WEBP o GIF)');
            }
            return true;
        }),

    body('categoryId')
        .notEmpty().withMessage('El ID de la categoría es requerido')
        .isMongoId().withMessage('El ID de la categoría debe ser un ObjectId válido'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),

    body('brandId')
        .optional()
        .isMongoId().withMessage('El ID de la marca debe ser un ObjectId válido'),

    body('modelId')
        .optional()
        .isMongoId().withMessage('El ID del modelo debe ser un ObjectId válido'),

    body('createdAt')
        .optional()
        .isISO8601().withMessage('La fecha de creación debe ser una fecha válida'),

    body('updatedAt')
        .optional()
        .isISO8601().withMessage('La fecha de actualización debe ser una fecha válida'),
];

const validateProductModificar = [
    body('_id')
        .notEmpty().withMessage('El ID es requerido')
        .isMongoId().withMessage('El ID no es válido'),
    body('name')
        .trim()
        .optional()
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),

    body('description')
        .trim()
        .optional()
        .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),

    body('price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),

    body('images')
        .optional()
        .isArray().withMessage('Las imágenes deben ser un array')
        .custom((images) => {
            if (!images.every(img => /\.(jpg|jpeg|png|webp|gif)$/.test(img))) {
                throw new Error('Cada imagen debe tener un formato válido (JPG, PNG, WEBP o GIF)');
            }
            return true;
        }),

    body('categoryId')
        .optional()
        .notEmpty().withMessage('El ID de la categoría es requerido')
        .isMongoId().withMessage('El ID de la categoría debe ser un ObjectId válido'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),

    body('brandId')
        .optional()
        .isMongoId().withMessage('El ID de la marca debe ser un ObjectId válido'),

    body('modelId')
        .optional()
        .isMongoId().withMessage('El ID del modelo debe ser un ObjectId válido'),

    body('createdAt')
        .optional()
        .isISO8601().withMessage('La fecha de creación debe ser una fecha válida'),

    body('updatedAt')
        .optional()
        .isISO8601().withMessage('La fecha de actualización debe ser una fecha válida'),
];

const validateProductID = [
    param('_id')
        .notEmpty().withMessage('El ID es requerido')
        .isMongoId().withMessage('El ID no es válido'),
];

export { validateProductRegistration, validateProductModificar, validateProductID };
