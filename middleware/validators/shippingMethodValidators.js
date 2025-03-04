import { check } from "express-validator";
import { validateResults } from "./commonValidator.js";

const validateCreateShippingMethod = [
    check("name")
        .exists()
        .notEmpty()
        .withMessage("El nombre es requerido")
        .trim(),
    check("company")
        .exists()
        .notEmpty()
        .withMessage("La empresa de transporte es requerida")
        .trim(),
    check("cost")
        .exists()
        .notEmpty()
        .withMessage("El costo es requerido")
        .isNumeric()
        .withMessage("El costo debe ser un número")
        .custom((value) => value >= 0)
        .withMessage("El costo no puede ser negativo"),
    check("estimatedDeliveryDays")
        .exists()
        .notEmpty()
        .withMessage("Los días estimados de entrega son requeridos")
        .isInt({ min: 1 })
        .withMessage("Los días estimados deben ser un número entero mayor a 0"),
    (req, res, next) => validateResults(req, res, next),
];

const validateUpdateShippingMethod = [
    check("name")
        .optional()
        .notEmpty()
        .withMessage("El nombre no puede estar vacío")
        .trim(),
    check("company")
        .optional()
        .notEmpty()
        .withMessage("La empresa de transporte no puede estar vacía")
        .trim(),
    check("cost")
        .optional()
        .notEmpty()
        .withMessage("El costo no puede estar vacío")
        .isNumeric()
        .withMessage("El costo debe ser un número")
        .custom((value) => value >= 0)
        .withMessage("El costo no puede ser negativo"),
    check("estimatedDeliveryDays")
        .optional()
        .notEmpty()
        .withMessage("Los días estimados no pueden estar vacíos")
        .isInt({ min: 1 })
        .withMessage("Los días estimados deben ser un número entero mayor a 0"),
    (req, res, next) => validateResults(req, res, next),
];

export { validateCreateShippingMethod, validateUpdateShippingMethod };