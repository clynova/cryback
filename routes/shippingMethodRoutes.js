import express from "express";
import {
    createShippingMethod,
    getShippingMethods,
    getShippingMethod,
    updateShippingMethod,
    deleteShippingMethod,
} from "../controllers/shippingMethodController.js";
import { validateCreateShippingMethod, validateUpdateShippingMethod } from "../middleware/validators/shippingMethodValidators.js";
import { checkAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", getShippingMethods);
router.get("/:id", getShippingMethod);

// Rutas protegidas - solo administradores
router.post("/", checkAuth, validateCreateShippingMethod, createShippingMethod);
router.put("/:id", checkAuth, validateUpdateShippingMethod, updateShippingMethod);
router.delete("/:id", checkAuth, deleteShippingMethod);

export default router;