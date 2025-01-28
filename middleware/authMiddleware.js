import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const checkAuth = async (req, res, next) => {
    try {

        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id).select("-password -token -confirmado")
            if (!user) {
                return res.status(404).send({ success: false, msg: 'Usuario no encontrado' });
            }
            req.user = user;

            return next();
        }

    } catch (err) {
        const error = new Error('Token no valido')
        res.status(403).send({ success: false, msg: error.message });
    }
}

export { checkAuth }