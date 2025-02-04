import { User } from "../models/User.js";
import { TokenBlacklist } from "../models/TokenBlacklist.js";
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

const updateProfile = async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const { idUserAdminEdit, firstName, lastName, email, address, phone } = req.body;
        const userId = req.user._id;

        let user;


        if (idUserAdminEdit) {
            const adminUser = await User.findById(userId);
            if (!adminUser.roles.includes("admin")) {
                return res.status(403).send({ success: false, msg: "No tienes permisos para editar este usuario" });
            }

            user = await User.findById(idUserAdminEdit);
            if (!user) {
                return res.status(404).send({ success: false, msg: "El usuario no existe" });
            }
        } else {
            user = await User.findById(userId);
            if (!user) {
                return res.status(404).send({ success: false, msg: "El usuario no existe" });
            }
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({ success: false, msg: "El correo ya está en uso" });
            }
            user.email = email;
        }
        if (address) user.address = address;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).send({ success: true, msg: "Perfil actualizado correctamente" });
    } catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al actualizar el perfil" });
    }

}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, repNewPassword } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ success: false, msg: "El usuario no existe" });
        }

        if (newPassword !== repNewPassword) {
            return res.status(400).send({ success: false, msg: "Las contraseñas no coinciden" });
        }


        const passwordValido = await user.comprobarPassword(currentPassword)
        if (!passwordValido) {
            return res.status(400).send({
                success: false,
                msg: "Credenciales incorrectas"
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).send({ success: true, msg: "Contraseya actualizada correctamente" });
    }
    catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al cambiar la contraseña" });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.params; // ID del usuario a eliminar
        const requestingUserId = req.user._id; // ID del usuario que hace la solicitud (obtenido del token)
        let log;


        // Verificar si el usuario que hace la solicitud existe
        const requestingUser = await User.findById(requestingUserId);
        if (!requestingUser) {
            return res.status(404).send({ success: false, msg: "Usuario no encontrado" });
        }


        // Verificar si el usuario a eliminar existe
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).send({ success: false, msg: "El usuario a eliminar no existe" });
        }

        // Si el usuario no es admin, solo puede eliminar su propia cuenta
        if (!requestingUser.roles.includes('admin') && requestingUserId.toString() !== userId.toString()) {
            return res.status(403).send({ success: false, msg: "No tienes permisos para eliminar esta cuenta" });
        }

        log = `Usuario ${userToDelete.username} con ID ${userToDelete._id} eliminado por ${requestingUser.username} con ID ${requestingUserId} con el rol ${requestingUser.roles}.`;

        // Eliminar la cuenta
        await User.findByIdAndDelete(userId);

        res.status(200).send({ success: true, msg: "Cuenta eliminada correctamente", log });
    } catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al eliminar la cuenta" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({ success: true, data: users });
    } catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al obtener los usuarios" });
    }
}

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUserId = req.user._id;

        // Verificar si el usuario que hace la solicitud es un administrador o el propio usuario
        const requestingUser = await User.findById(requestingUserId);
        if (!requestingUser || (!requestingUser.roles.includes('admin') && requestingUserId.toString() !== userId.toString())) {
            return res.status(403).send({ success: false, msg: "No tienes permisos para realizar esta acción" });
        }

        // Obtener el usuario
        const user = await User.findById(userId, { password: 0, token: 0 }); // Excluir campos sensibles
        if (!user) {
            return res.status(404).send({ success: false, msg: "Usuario no encontrado" });
        }

        res.status(200).send({ success: true, data: user });
    } catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al obtener el usuario" });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(400).send({ success: false, msg: "Token no proporcionado" });
        }

        // Verificar si el token ya está en la lista negra
        const tokenExists = await TokenBlacklist.findOne({ token });
        if (tokenExists) {
            return res.status(400).send({ success: false, msg: "El token ya ha sido invalidado" });
        }

        // Agregar el token a la lista negra
        await TokenBlacklist.create({ token });

        res.status(200).send({ success: true, msg: "Sesión cerrada correctamente" });
    } catch (err) {
        res.status(500).send({ success: false, msg: "Hubo un error al cerrar la sesión" });
    }
};




export {
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
};
