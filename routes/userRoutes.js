import express from 'express';
import {
    registrar,
    confirmar,
    autenticar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    updateProfile,
    changePassword,
    deleteAccount,
    getAllUsers,
    getUserById,
    logout
} from '../controllers/userController.js';
import {
    validateUserRegistration,
    validarAutenticar,
    validarNuevaPassword,
    validarCambiarPassword
} from '../middleware/validators/userValidators.js';
import { checkAuth, checkTokenBlacklist } from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

// Rutas públicas (no requieren autenticación)
userRoutes.post('/registrar', validateUserRegistration, registrar); // Registrar un nuevo usuario
userRoutes.get('/confirmar/:token', confirmar); // Confirmar cuenta de usuario
userRoutes.post('/autenticar', validarAutenticar, autenticar); // Autenticar usuario (login)

// Rutas para restablecer contraseña
userRoutes.post('/reset-password', resetPassword); // Solicitar restablecimiento de contraseña
userRoutes.get('/reset-password/:token', comprobarToken); // Verificar token de restablecimiento
userRoutes.post('/reset-password/:token', validarNuevaPassword, nuevoPassword); // Establecer nueva contraseña

// Rutas protegidas (requieren autenticación y validación de token)
userRoutes.use(checkAuth, checkTokenBlacklist); // Middleware aplicado a todas las rutas siguientes

userRoutes.get('/perfil', getUserById); // Obtener perfil del usuario autenticado
userRoutes.get('/perfil/:userId', getUserById); // Obtener perfil de un usuario específico (solo para administradores)
userRoutes.put('/perfil', updateProfile); // Actualizar perfil del usuario autenticado
userRoutes.put('/change-password', validarCambiarPassword, changePassword); // Cambiar contraseña del usuario autenticado
userRoutes.delete('/delete-account/:userId', deleteAccount); // Eliminar cuenta (propia o de otro usuario si es admin)

// Rutas de administración (solo para administradores)
userRoutes.get('/all', getAllUsers); // Obtener todos los usuarios (solo para administradores)

// Cerrar sesión
userRoutes.post('/logout', logout); // Cerrar sesión e invalidar token

export { userRoutes };