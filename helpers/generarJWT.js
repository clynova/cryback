import jwt from 'jsonwebtoken';

const generarJWT = (id, email) => {
    const token = jwt.sign(
        { id, email }, // Payload
        process.env.JWT_SECRET, // Clave secreta (debe estar en las variables de entorno)
        { expiresIn: '30d' } // Tiempo de expiración del token
    );
    return token
}

export { generarJWT }