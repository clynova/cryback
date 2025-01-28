import express from 'express'
import { body, validationResult } from 'express-validator';
import { registrar, perfil, confirmar } from '../controllers/userController.js';
const userRoutes = express.Router();

userRoutes.post('/', [
    body('firstName').notEmpty().withMessage('El nombre es requerido'),
    body('lastName').notEmpty().withMessage('El apellido es requerido'),
    body('email').isEmail().withMessage('El correo no es válido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
], registrar);
userRoutes.get('/perfil', perfil)
userRoutes.get('/confirmar/:token', confirmar)


export { userRoutes }
