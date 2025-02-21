import { body } from 'express-validator';

const validateUserRegistration = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('El apellido es requerido')
        .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo puede contener letras')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),

    body('email')
        .trim()
        .notEmpty().withMessage('El correo es requerido')
        .isEmail().withMessage('El correo no es válido'),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe incluir al menos un carácter especial (!@#$%^&*)'),

    body('repPassword')
        .notEmpty().withMessage('La confirmación de la contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La confirmación de la contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La confirmación de la contraseña debe incluir al menos una letra mayúscula')
        .matches(/\d/).withMessage('La confirmación de la contraseña debe incluir al menos un número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La confirmación de la contraseña debe incluir al menos un carácter especial (!@#$%^&*)')
];

const validarAutenticar = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es requerido')
        .isEmail().withMessage('El correo no es válido'),

    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número')
];

const validarNuevaPassword = [
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe incluir al menos un carácter especial (!@#$%^&*)'),
];

const validarCambiarPassword = [
    body('currentPassword')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe incluir al menos un carácter especial (!@#$%^&*)'),

    body('newPassword')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula')
        .matches(/\d/).withMessage('La contraseña debe incluir al menos un número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('La contraseña debe incluir al menos un carácter especial (!@#$%^&*)'),

    body('repNewPassword')
        .notEmpty().withMessage('La confirmación de la contraseña es requerida')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
];

export { validateUserRegistration, validarAutenticar, validarNuevaPassword, validarCambiarPassword };
