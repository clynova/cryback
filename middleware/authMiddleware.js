import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const checkAuth = async (req, res, next) => {
    try {
        let token;

        // Verificar si el token está en el encabezado Authorization
        if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1].trim(); // Extraer y limpiar el token
        }

        // Si no hay token, devolver un error
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: 'Acceso denegado: No se proporcionó un token'
            });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const user = await User.findById(decoded._id).select("-password -token");

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Acceso denegado: Usuario no encontrado'
            });
        }

        // Verificar si el usuario esta confirmado
        if (!user.confirmado) {
            return res.status(403).json({
                success: false,
                msg: 'Acceso denegado: Usuario no confirmado'
            });
        }

        // Adjuntar el usuario al objeto `req` para usarlo en el controlador
        req.user = user;
        next();

    } catch (err) {
        console.error("Error en checkAuth:", err);

        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                msg: 'Token inválido'
            });
        }

        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                msg: 'Token expirado, por favor inicie sesión nuevamente'
            });
        }

        return res.status(500).json({
            success: false,
            msg: 'Error en la autenticación'
        });
    }
};

const checkRole = (role) => (req, res, next) => {
    if (!req.user.roles.includes(role)) {
        return res.status(403).json({ success: false, msg: 'No tienes permisos para realizar esta acción' });
    }
    next();
};


const checkOwnerOrAdmin = (Model, idField = "_id") => async (req, res, next) => {
    try {
        const resourceId = req.params[idField]; // ID desde la URL
        const userId = req.user._id; // ID del usuario autenticado

        // Buscar el recurso en la base de datos (puede ser un Cart, Order o User)
        const resource = await Model.findById(resourceId);

        if (!resource) {
            return res.status(404).json({ success: false, msg: "Recurso no encontrado" });
        }

        // Si el usuario no es dueño del recurso y no es admin, bloquear
        if (resource.userId.toString() !== userId.toString() && !req.user.roles.includes("admin")) {
            return res.status(403).json({ success: false, msg: "No tienes permiso para realizar esta acción" });
        }

        next(); // Si pasa la validación, continuar con la siguiente función
    } catch (err) {
        console.error("Error en checkOwnerOrAdmin:", err);
        res.status(500).json({ success: false, msg: "Error al verificar permisos" });
    }
};

export { checkAuth, checkRole, checkOwnerOrAdmin };
