import { Category } from "../models/Category.js";
import { validationResult } from 'express-validator';

const categorias = async (req, res) => {
    try {
        const categorias = await Category.find()

        res.status(201).send({ success: true, msg: 'Categorias enviadas', categorias });
    } catch (err) {
        res.status(400).send({ success: false, msg: err })
    }
}

const crearCategoria = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const category = new Category(req.body)
        const categoryGuardada = await category.save();

        res.status(201).send({
            success: true,
            msg: "Categoria creada correctamente",
            data: {
                name: categoryGuardada.name,
                description: categoryGuardada.description
            }
        });
    } catch (err) {
        res.status(400).send({ success: false, msg: "Error al registrar la categoria" })
    }
}

const modificarCategoria = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const { _id, name, description } = req.body

        const category = await Category.findById(_id)
        category.name = name
        category.description = description
        const categoryGuardada = await category.save();

        res.status(201).send({
            success: true,
            msg: "Categoria modificada correctamente",
            data: {
                _id: categoryGuardada._id,
                name: categoryGuardada.name,
                description: categoryGuardada.description
            }
        });
    } catch (err) {
        res.status(400).send({ success: false, msg: "Error al modificar la categoria" })
    }
}

const eliminarCategoria = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, msg: "Errores de validación", errors: errors.array() });
        }
        const category = await Category.findOneAndDelete({ _id: req.body._id });

        if (!category) {
            return res.status(404).json({ success: false, msg: "Categoría no encontrada" });
        }

        res.status(200).json({
            success: true,
            msg: "Categoría eliminada correctamente",
            data: {
                _id: category._id,
                name: category.name
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error interno al eliminar la categoría" });
    }
};

export { categorias, crearCategoria, modificarCategoria, eliminarCategoria }