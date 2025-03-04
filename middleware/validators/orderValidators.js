import { check } from "express-validator";
import { validateResults } from "./commonValidator.js";

const validateCreateOrder = [
    check("shippingAddress")
        .isObject()
        .withMessage("La dirección de envío es requerida"),
    check("shippingAddress.street")
        .notEmpty()
        .withMessage("La calle es requerida"),
    check("shippingAddress.city")
        .notEmpty()
        .withMessage("La ciudad es requerida"),
    check("shippingAddress.state")
        .notEmpty()
        .withMessage("El estado es requerido"),
    check("shippingAddress.zipCode")
        .notEmpty()
        .withMessage("El código postal es requerido"),
    check("shippingAddress.country")
        .notEmpty()
        .withMessage("El país es requerido"),
    check("paymentMethod")
        .optional() // Haciendo el campo opcional
        .isIn(["credit_card", "debit_card", "paypal"])
        .withMessage("Método de pago no válido"),
    check("shippingMethodId")
        .notEmpty()
        .withMessage("El método de envío es requerido")
        .isMongoId()
        .withMessage("ID de método de envío no válido"),
    (req, res, next) => validateResults(req, res, next),
];

const validateUpdateOrder = [
    check("status")
        .optional()
        .isIn(["pending", "completed", "canceled"])
        .withMessage("Estado no válido"),
    check("shippingMethodId")
        .optional()
        .isMongoId()
        .withMessage("ID de método de envío no válido"),
    check("paymentMethod")
        .optional()
        .isIn(["credit_card", "debit_card", "paypal"])
        .withMessage("Método de pago no válido"),
    check("shippingAddress")
        .optional()
        .isObject()
        .withMessage("La dirección de envío debe ser un objeto"),
    (req, res, next) => validateResults(req, res, next),
];

export { validateCreateOrder, validateUpdateOrder };
