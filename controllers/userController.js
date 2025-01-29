import { User } from "../models/User.js";
import { generarId } from '../helpers/generarId.js';
import { validationResult } from 'express-validator';
import { generarJWT } from "../helpers/generarJWT.js";

const registrar = async (req, res) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const usuarioExistente = await User.findOne({ email: req.body.email });
        if (usuarioExistente) {
            return res.status(400).send({ success: false, msg: "El correo ya está registrado" });
        }

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

const confirmar = async (req, res) => {
    try {
        const usuarioExistente = await User.findOne({ token: req.params.token });
        if (!usuarioExistente) {
            return res.status(400).send({ msg: "El token no es valido" });
        }

        usuarioExistente.token = null
        usuarioExistente.confirmado = true
        await usuarioExistente.save()

        res.status(201).send({ success: true, msg: "Usuario confirmado correctamente." });
    } catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al validar el token del usuario" });
    }
};

const autenticar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const { email, password } = req.body;

        const usuarioExistente = await User.findOne({ email });
        if (!usuarioExistente) {
            return res.status(400).send({ success: false, msg: "El correo ingresado no existe" });
        }

        if (!usuarioExistente.confirmado) {
            return res.status(400).send({ success: false, msg: "El usuario no ha activado su cuenta" });
        }

        const passwordValido = await usuarioExistente.comprobarPassword(password)
        if (!passwordValido) {
            return res.status(400).send({
                success: false,
                msg: "Credenciales incorrectas"
            });
        }

        console.log(`aca`);

        const token = generarJWT(usuarioExistente._id, usuarioExistente.email)
        
        res.status(200).send({
            success: true,
            msg: "Autenticación exitosa",
            token,
            user: {
                id: usuarioExistente._id,
                firstName: usuarioExistente.firstName,
                lastName: usuarioExistente.lastName,
                email: usuarioExistente.email,
                roles: usuarioExistente.roles,
                confirmado: usuarioExistente.confirmado
            }
        });
    } catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al autenticar el usuario" });
    }
}

const perfil = (req, res) => {
    res.status(201).send({ success: true, msg: 'Perfil de usuario', user: req.user });
};

const resetPassword = async (req, res) => {

    const usuarioExistente = await User.findOne({ email: req.body.email });
    if (!usuarioExistente) {
        return res.status(400).send({ success: false, msg: "No se encontro usuario con este email" });
    }

    usuarioExistente.token = generarId();
    await usuarioExistente.save()


    res.status(201).send({ success: true, msg: 'Se envio mensaje token para resetear password' });
};

const comprobarToken = async (req, res) => {
    const usuarioExistente = await User.findOne({ token: req.params.token });
    if (!usuarioExistente) {
        return res.status(400).send({ msg: "El token no es valido" });
    }
    res.status(200).send({ success: true, msg: 'Se valido el token, crea la nueva password' });
};

const nuevoPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const { password } = req.body;
        const usuarioExistente = await User.findOne({ token: req.params.token });

        if (!usuarioExistente) {
            return res.status(400).send({ success: false, msg: "El token no es válido" });
        }

        usuarioExistente.token = null;
        usuarioExistente.password = password;
        await usuarioExistente.save();

        res.status(200).send({ success: true, msg: "Contraseña actualizada correctamente" });
    } catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al actualizar la contraseña" });
    }
};



export { registrar, perfil, confirmar, autenticar, resetPassword, comprobarToken, nuevoPassword };
