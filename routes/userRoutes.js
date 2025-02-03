import express, { Router } from 'express'
import { registrar, perfil, confirmar, autenticar, resetPassword, comprobarToken, nuevoPassword, updateProfile, changePassword, deleteAccount } from '../controllers/userController.js';
import { validateUserRegistration, validarAutenticar, validarNuevaPassword, validarCambiarPassword } from '../middleware/validators/userValidators.js';
import { checkAuth, checkOwnerOrAdmin } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';

const userRoutes = express.Router();

userRoutes.post('/registrar', validateUserRegistration, registrar);
userRoutes.get('/confirmar/:token', confirmar)
userRoutes.post('/autenticar', validarAutenticar, autenticar)

userRoutes.post('/reset-password', resetPassword)
userRoutes.get('/reset-password/:token', comprobarToken);
userRoutes.post('/reset-password/:token', validarNuevaPassword, nuevoPassword);



userRoutes.get('/perfil', checkAuth, perfil)
userRoutes.put('/perfil', checkAuth, updateProfile)
userRoutes.put('/change-password', checkAuth, validarCambiarPassword, changePassword)
userRoutes.delete('/delete-account/:userId', checkAuth, deleteAccount)

export { userRoutes }
