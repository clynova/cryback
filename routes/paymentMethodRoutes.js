import express from "express";
import {
    createPaymentMethod,
    getPaymentMethods,
    getAllPaymentMethods,
    getPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    restorePaymentMethod
} from "../controllers/paymentMethodController.js";
import { validateCreatePaymentMethod, validateUpdatePaymentMethod } from "../middleware/validators/paymentMethodValidators.js";
import { checkAuth, checkOwnerOrAdmin } from "../middleware/authMiddleware.js";

const paymentMethodRoutes = express.Router();

// Rutas públicas
paymentMethodRoutes.get("/", getPaymentMethods);
paymentMethodRoutes.get("/:id", getPaymentMethod);

// Rutas protegidas - solo administradores
paymentMethodRoutes.get("/admin/all", checkAuth, checkOwnerOrAdmin('admin'), getAllPaymentMethods);
paymentMethodRoutes.post("/", checkAuth, checkOwnerOrAdmin('admin'), validateCreatePaymentMethod, createPaymentMethod);
paymentMethodRoutes.put("/:id", checkAuth, checkOwnerOrAdmin('admin'), validateUpdatePaymentMethod, updatePaymentMethod);
paymentMethodRoutes.delete("/:id", checkAuth, checkOwnerOrAdmin('admin'), deletePaymentMethod);
paymentMethodRoutes.put("/restore/:id", checkAuth, checkOwnerOrAdmin('admin'), restorePaymentMethod);

export { paymentMethodRoutes }; 