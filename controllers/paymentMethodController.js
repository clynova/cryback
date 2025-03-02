import { PaymentMethod } from '../models/PaymentMethod.js';
import CryptoJS from 'crypto-js';
import { validationResult } from 'express-validator';

// Clave secreta para encriptación (debería estar en variables de entorno)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'tu_clave_secreta_muy_segura';

const encryptData = (text) => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decryptData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const addPaymentMethod = async (req, res) => {
    try {
        const userId = req.user._id;
        const paymentData = { ...req.body };

        // Si es el primer método de pago o se marca como predeterminado
        if (paymentData.isDefault) {
            await PaymentMethod.updateMany(
                { userId: userId },
                { $set: { isDefault: false } }
            );
        }

        // Encriptar información sensible
        if (paymentData.cardNumber) {
            paymentData.cardNumber = encryptData(paymentData.cardNumber);
        }
        if (paymentData.paypalEmail) {
            paymentData.paypalEmail = encryptData(paymentData.paypalEmail);
        }

        // Si es la primera tarjeta, establecerla como predeterminada
        const existingMethods = await PaymentMethod.countDocuments({ userId });
        if (existingMethods === 0) {
            paymentData.isDefault = true;
        }

        const paymentMethod = new PaymentMethod({
            ...paymentData,
            userId
        });

        await paymentMethod.save();
        
        res.status(201).send({
            success: true,
            msg: 'Método de pago agregado correctamente',
            data: paymentMethod
        });
    } catch (error) {
        console.error('Error al agregar método de pago:', error);
        res.status(500).send({
            success: false,
            msg: 'Error al agregar el método de pago',
            error: error.message
        });
    }
};

const getPaymentMethods = async (req, res) => {
    try {
        const userId = req.user._id;
        const paymentMethods = await PaymentMethod.find({ 
            userId,
            isActive: true
        });

        res.status(200).send({
            success: true,
            data: paymentMethods
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: 'Error al obtener los métodos de pago',
            error: error.message
        });
    }
};

const updatePaymentMethod = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, errors: errors.array() });
        }

        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const paymentMethod = await PaymentMethod.findOne({ _id: id, userId });
        if (!paymentMethod) {
            return res.status(404).send({
                success: false,
                msg: 'Método de pago no encontrado'
            });
        }

        // Si se está estableciendo como predeterminado
        if (updateData.isDefault) {
            await PaymentMethod.updateMany(
                { userId, _id: { $ne: id } },
                { $set: { isDefault: false } }
            );
        }

        // Encriptar nueva información sensible si se proporciona
        if (updateData.cardNumber) {
            updateData.cardNumber = encryptData(updateData.cardNumber);
        }
        if (updateData.paypalEmail) {
            updateData.paypalEmail = encryptData(updateData.paypalEmail);
        }

        const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true }
        );

        res.status(200).send({
            success: true,
            msg: 'Método de pago actualizado correctamente',
            data: updatedPaymentMethod
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: 'Error al actualizar el método de pago',
            error: error.message
        });
    }
};

const deletePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const paymentMethod = await PaymentMethod.findOne({ _id: id, userId });
        if (!paymentMethod) {
            return res.status(404).send({
                success: false,
                msg: 'Método de pago no encontrado'
            });
        }

        // Soft delete: marcar como inactivo en lugar de eliminar
        paymentMethod.isActive = false;
        await paymentMethod.save();

        // Si era el método predeterminado, establecer otro como predeterminado
        if (paymentMethod.isDefault) {
            const anotherPaymentMethod = await PaymentMethod.findOne({
                userId,
                isActive: true,
                _id: { $ne: id }
            });
            if (anotherPaymentMethod) {
                anotherPaymentMethod.isDefault = true;
                await anotherPaymentMethod.save();
            }
        }

        res.status(200).send({
            success: true,
            msg: 'Método de pago eliminado correctamente'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: 'Error al eliminar el método de pago',
            error: error.message
        });
    }
};

const setDefaultPaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const paymentMethod = await PaymentMethod.findOne({ _id: id, userId });
        if (!paymentMethod) {
            return res.status(404).send({
                success: false,
                msg: 'Método de pago no encontrado'
            });
        }

        // Quitar el estado predeterminado de todos los demás métodos de pago
        await PaymentMethod.updateMany(
            { userId, _id: { $ne: id } },
            { $set: { isDefault: false } }
        );

        // Establecer este método como predeterminado
        paymentMethod.isDefault = true;
        await paymentMethod.save();

        res.status(200).send({
            success: true,
            msg: 'Método de pago establecido como predeterminado',
            data: paymentMethod
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            msg: 'Error al establecer el método de pago predeterminado',
            error: error.message
        });
    }
};

export {
    addPaymentMethod,
    getPaymentMethods,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
};