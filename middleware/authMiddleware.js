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
        const user = await User.findById(decoded._id).select("-password -token -confirmado");
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                msg: 'Acceso denegado: Usuario no encontrado' 
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

export { checkAuth };
