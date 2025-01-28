import express from 'express'
import { registrar, perfil, confirmar, autenticar } from '../controllers/userController.js';
import { validateUserRegistration, validarAutenticar } from '../middleware/validators/userValidators.js';

const userRoutes = express.Router();

userRoutes.post('/registrar', validateUserRegistration, registrar);
userRoutes.get('/post', perfil)
userRoutes.get('/confirmar/:token', confirmar)
userRoutes.post('/autenticar', validarAutenticar, autenticar)

export { userRoutes }
