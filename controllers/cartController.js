import { Cart } from '../models/Cart.js';
import { Product } from "../models/Product.js";
import mongoose from 'mongoose';

const addToCart = async (req, res) => {
    try {
        let { productId, quantity } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, msg: "ID de producto inválido" });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, msg: "Cantidad inválida" });
        }

        // Verifica si el producto existe antes de modificar el carrito
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, msg: "Producto no encontrado" });
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Si no existe, crear un nuevo carrito con el producto
            cart = new Cart({
                userId,
                products: [{ productId, quantity }],
            });
        } else {
            // Buscar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex > -1) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({ productId, quantity });
            }
        }

        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({ success: true, cart });

    } catch (err) {
        console.error("Error al agregar al carrito:", err);
        res.status(500).json({ success: false, msg: "Error al agregar al carrito" });
    }
};

export { addToCart };
