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

const validarNuevaPassword = [
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número'),
    body('repPassword')
        .notEmpty().withMessage('La confirmación de la contraseña es requerida')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
];


export { validateUserRegistration, validarAutenticar, validarNuevaPassword }