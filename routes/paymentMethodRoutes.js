import express from 'express';
import { checkAuth } from '../middleware/authMiddleware.js';
import {
    addPaymentMethod,
    getPaymentMethods,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
} from '../controllers/paymentMethodController.js';
import {
    validatePaymentMethod,
    validatePaymentMethodUpdate
} from '../middleware/validators/paymentMethodValidators.js';

const paymentMethodRoutes = express.Router();

// Todas las rutas requieren autenticación
paymentMethodRoutes.use(checkAuth);

// Rutas de métodos de pago
paymentMethodRoutes.post('/', validatePaymentMethod, addPaymentMethod);
paymentMethodRoutes.get('/', getPaymentMethods);
paymentMethodRoutes.put('/:id', validatePaymentMethodUpdate, updatePaymentMethod);
paymentMethodRoutes.delete('/:id', deletePaymentMethod);
paymentMethodRoutes.put('/:id/default', setDefaultPaymentMethod);

export { paymentMethodRoutes };