import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { validationResult } from 'express-validator';

const productos = async (req, res) => {
    try {
        const productos = await Product.find();
        res.status(200).send({ success: true, msg: 'Productos enviados', productos });
    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Error al obtener los productos" });
    }
};

const crearProducto = async (req, res) => {
    try {
        // Validar errores de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const { categoryId } = req.body;

        // Verificar si la categoría existe
        const categoriaExiste = await Category.findById(categoryId);
        if (!categoriaExiste) {
            return res.status(400).send({ success: false, msg: "La categoría no existe" });
        }

        // Crear el producto si la categoría es válida
        const product = new Product(req.body);
        const productGuardado = await product.save();

        res.status(201).send({
            success: true,
            msg: "Producto creado correctamente",
            data: {
                _id: productGuardado._id,
                name: productGuardado.name,
                description: productGuardado.description,
                categoryId: productGuardado.categoryId
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ success: false, msg: "Error al registrar el producto" });
    }
};

const modificarProducto = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const { _id } = req.params; 
        const { name, description, price, images, categoryId, stock, brandId, modelId } = req.body;



        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).json({ success: false, msg: "Producto no encontrado" });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (images) product.images = images;
        if (categoryId) {
            const categoriaExiste = await Category.findById(categoryId);
            if (!categoriaExiste) {
                return res.status(400).send({ success: false, msg: "La categoría no existe" });
            }
            product.categoryId = categoryId;
        }
        if (stock !== undefined) product.stock = stock;
        if (brandId) product.brandId = brandId;
        if (modelId) product.modelId = modelId;
        product.updatedAt = new Date();
        await product.save()

        res.status(200).json({
            success: true,
            msg: "Producto modificado correctamente",
            data: product
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Error al modificar el producto" });
    }
};




const eliminarProducto = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, msg: "Errores de validación", errors: errors.array() });
        }

        const { _id } = req.params; // Obtener el ID desde la URL

        // Buscar y eliminar el producto
        const product = await Product.findByIdAndDelete(_id);

        if (!product) {
            return res.status(404).json({ success: false, msg: "Producto no encontrado" });
        }

        res.status(200).json({
            success: true,
            msg: "Producto eliminado correctamente",
            data: {
                _id: product._id,
                name: product.name
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Error interno al eliminar el producto" });
    }
};


export { productos, crearProducto, modificarProducto, eliminarProducto }