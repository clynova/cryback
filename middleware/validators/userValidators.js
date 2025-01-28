// validators/userValidators.js
import { body } from 'express-validator';

const validateUserRegistration = [
    body('firstName').notEmpty().withMessage('El nombre es requerido'),
    body('lastName').notEmpty().withMessage('El apellido es requerido'),
    body('email').isEmail().withMessage('El correo no es válido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
];

const validarAutenticar = [
    body('email').isEmail().withMessage('El correo no es válido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
]

export { validateUserRegistration, validarAutenticar }