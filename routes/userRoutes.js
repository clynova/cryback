import express, { Router } from 'express'
import { registrar, perfil, confirmar, autenticar, resetPassword, comprobarToken, nuevoPassword } from '../controllers/userController.js';
import { validateUserRegistration, validarAutenticar, validarNuevaPassword } from '../middleware/validators/userValidators.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

userRoutes.post('/registrar', validateUserRegistration, registrar);
userRoutes.get('/confirmar/:token', confirmar)
userRoutes.post('/autenticar', validarAutenticar, autenticar)

userRoutes.post('/reset-password', resetPassword)
userRoutes.get('/reset-password/:token', comprobarToken);
userRoutes.post('/reset-password/:token', validarNuevaPassword, nuevoPassword);



userRoutes.get('/perfil', checkAuth, perfil)

export { userRoutes }
