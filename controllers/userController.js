import { User } from "../models/User.js";
import { generarId } from '../helpers/generarId.js';
import { validationResult } from 'express-validator'; // Para validación de datos

const registrar = async (req, res) => {
    try {
        // Validar campos con express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await User.findOne({ email: req.body.email });
        if (usuarioExistente) {
            return res.status(400).send({ success: false, msg: "El correo ya está registrado" });
        }

        // Generar token y crear usuario
        req.body.token = generarId();
        const user = new User(req.body);
        const userGuardado = await user.save();

        // Respuesta al cliente
        res.status(201).send({
            success: true,
            msg: "Usuario registrado correctamente",
            data: {
                id: userGuardado._id,
                firstName: userGuardado.firstName,
                lastName: userGuardado.lastName,
                email: userGuardado.email,
                roles: userGuardado.roles,
                confirmado: userGuardado.confirmado
            }
        });

    } catch (err) {
        console.error("Error en el controlador de registro:", err);
        res.status(500).send({ success: false, msg: "Hubo un error al registrar el usuario" });
    }
};

const perfil = (req, res) => {
    res.send({ url: "Mostrando Perfil" });
};

const confirmar = async (req, res) => {

    try {     
        const usuarioExistente = await User.findOne({ token: req.params.token });
        if (!usuarioExistente) {
            return res.status(400).send({ msg: "El token no es valido" });
        }
        res.status(201).send({ msg: "Token encontrado" });
    } catch (err) {

    }


};

export { registrar, perfil, confirmar };
