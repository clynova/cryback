import { Product } from "../models/Product.js";
import { validationResult } from 'express-validator';

/**
 * Obtener todas las etiquetas únicas del sistema
 */
const getAllTags = async (req, res) => {
    try {
        // Encuentra todas las etiquetas únicas en la colección de productos
        const allProducts = await Product.find({}, 'tags');
        
        // Extrae y aplana las etiquetas de todos los productos
        const allTags = allProducts.reduce((tags, product) => {
            return tags.concat(product.tags || []);
        }, []);
        
        // Elimina duplicados y ordena alfabéticamente
        const uniqueTags = [...new Set(allTags)].sort();
        
        res.status(200).send({ 
            success: true, 
            msg: 'Etiquetas enviadas', 
            tags: uniqueTags 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            success: false, 
            msg: "Error al obtener las etiquetas"
        });
    }
};

/**
 * Obtener etiquetas de un producto específico
 */
const getProductTags = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ 
                success: false, 
                msg: "El producto no existe" 
            });
        }
        
        res.status(200).send({ 
            success: true, 
            msg: 'Etiquetas del producto enviadas', 
            tags: product.tags || [] 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            success: false, 
            msg: "Error al obtener las etiquetas del producto" 
        });
    }
};

/**
 * Añadir etiquetas a un producto
 */
const addTagsToProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ 
                success: false, 
                msg: "Errores de validación", 
                errors: errors.array() 
            });
        }
        
        const { productId } = req.params;
        const { tags } = req.body;
        
        if (!Array.isArray(tags)) {
            return res.status(400).send({ 
                success: false, 
                msg: "El campo 'tags' debe ser un array de strings" 
            });
        }
        
        // Validar que todos los elementos sean strings y aplicar trim
        const validTags = tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0)
                              .map(tag => tag.trim());
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ 
                success: false, 
                msg: "El producto no existe" 
            });
        }
        
        // Asegurar que product.tags es un array
        if (!product.tags) {
            product.tags = [];
        }
        
        // Añadir sólo etiquetas que no existan ya en el producto
        const newTags = validTags.filter(tag => !product.tags.includes(tag));
        product.tags = [...product.tags, ...newTags];
        
        await product.save();
        
        res.status(200).send({
            success: true,
            msg: "Etiquetas añadidas correctamente",
            data: {
                productId: product._id,
                tags: product.tags
            }
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            success: false, 
            msg: "Error al añadir etiquetas al producto" 
        });
    }
};

/**
 * Actualizar todas las etiquetas de un producto (reemplazar)
 */
const updateProductTags = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ 
                success: false, 
                msg: "Errores de validación", 
                errors: errors.array() 
            });
        }
        
        const { productId } = req.params;
        const { tags } = req.body;
        
        if (!Array.isArray(tags)) {
            return res.status(400).send({ 
                success: false, 
                msg: "El campo 'tags' debe ser un array de strings" 
            });
        }
        
        // Validar que todos los elementos sean strings y aplicar trim
        const validTags = tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0)
                              .map(tag => tag.trim());
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ 
                success: false, 
                msg: "El producto no existe" 
            });
        }
        
        // Reemplazar todas las etiquetas
        product.tags = validTags;
        await product.save();
        
        res.status(200).send({
            success: true,
            msg: "Etiquetas actualizadas correctamente",
            data: {
                productId: product._id,
                tags: product.tags
            }
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            success: false, 
            msg: "Error al actualizar las etiquetas del producto" 
        });
    }
};

/**
 * Eliminar etiquetas específicas de un producto
 */
const removeTagsFromProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ 
                success: false, 
                msg: "Errores de validación", 
                errors: errors.array() 
            });
        }
        
        const { productId } = req.params;
        const { tags } = req.body;
        
        if (!Array.isArray(tags)) {
            return res.status(400).send({ 
                success: false, 
                msg: "El campo 'tags' debe ser un array de strings" 
            });
        }
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ 
                success: false, 
                msg: "El producto no existe" 
            });
        }
        
        // Eliminar las etiquetas especificadas
        product.tags = (product.tags || []).filter(tag => !tags.includes(tag));
        await product.save();
        
        res.status(200).send({
            success: true,
            msg: "Etiquetas eliminadas correctamente",
            data: {
                productId: product._id,
                tags: product.tags
            }
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            success: false, 
            msg: "Error al eliminar etiquetas del producto" 
        });
    }
};

/**
 * Buscar productos por etiquetas
 */
const findProductsByTags = async (req, res) => {
    try {
        const { tags } = req.query;
        
        if (!tags) {
            return res.status(400).send({ 
                success: false, 
                msg: "Se requiere al menos una etiqueta para la búsqueda" 
            });
        }
        
        // Convertir a array si viene como string
        const tagArray = Array.isArray(tags) ? tags : tags.split(',');
        
        // Buscar productos que contengan al menos una de las etiquetas
        const products = await Product.find({ tags: { $in: tagArray } });
        
        res.status(200).send({
            success: true,
            msg: "Productos encontrados",
            count: products.length,
            products
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            success: false, 
            msg: "Error al buscar productos por etiquetas" 
        });
    }
};

/**
 * Renombrar una etiqueta en todo el sistema
 */
const renameTag = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ 
                success: false, 
                msg: "Errores de validación", 
                errors: errors.array() 
            });
        }
        
        const { oldTag, newTag } = req.body;
        
        if (!oldTag || !newTag || typeof oldTag !== 'string' || typeof newTag !== 'string') {
            return res.status(400).send({ 
                success: false, 
                msg: "Se requieren los campos 'oldTag' y 'newTag' como strings" 
            });
        }
        
        // Buscar todos los productos que contengan la etiqueta antigua
        const productsToUpdate = await Product.find({ tags: oldTag });
        
        // Actualizar la etiqueta en cada producto
        const updatePromises = productsToUpdate.map(product => {
            const tagIndex = product.tags.indexOf(oldTag);
            if (tagIndex !== -1) {
                product.tags[tagIndex] = newTag;
                return product.save();
            }
            return Promise.resolve();
        });
        
        await Promise.all(updatePromises);
        
        res.status(200).send({
            success: true,
            msg: "Etiqueta renombrada correctamente",
            data: {
                oldTag,
                newTag,
                productsUpdated: productsToUpdate.length
            }
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            success: false, 
            msg: "Error al renombrar la etiqueta" 
        });
    }
};

/**
 * Eliminar una etiqueta de todo el sistema
 */
const deleteTag = async (req, res) => {
    try {
        const { tag } = req.params;
        
        if (!tag) {
            return res.status(400).send({ 
                success: false, 
                msg: "Se requiere especificar la etiqueta a eliminar" 
            });
        }
        
        // Actualizar todos los productos que contengan la etiqueta
        const result = await Product.updateMany(
            { tags: tag },
            { $pull: { tags: tag } }
        );
        
        res.status(200).send({
            success: true,
            msg: "Etiqueta eliminada correctamente",
            data: {
                tag,
                productsUpdated: result.modifiedCount
            }
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            success: false, 
            msg: "Error al eliminar la etiqueta" 
        });
    }
};

export {
    getAllTags,
    getProductTags,
    addTagsToProduct,
    updateProductTags,
    removeTagsFromProduct,
    findProductsByTags,
    renameTag,
    deleteTag
}; 