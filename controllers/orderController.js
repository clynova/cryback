import { Order } from '../models/Order.js';
import { OrderDetail } from '../models/OrderDetail.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import mongoose from 'mongoose';

const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { shippingAddress, paymentMethod } = req.body;

        // Validar el método de pago
        const validPaymentMethods = ["card", "paypal", "bank_transfer"];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ success: false, msg: "Método de pago inválido" });
        }

        // Validar la dirección de envío
        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
            return res.status(400).json({ success: false, msg: "Dirección de envío incompleta" });
        }

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ success: false, msg: "El carrito está vacío" });
        }

        // Calcular el total de la orden y verificar el stock
        let total = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ success: false, msg: `Producto no encontrado: ${item.productId}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, msg: `Stock insuficiente para el producto: ${product.name}` });
            }
            total += product.price * item.quantity;
        }

        // Crear la orden
        const order = new Order({
            userId,
            orderDate: new Date(),
            status: "pending", // Estado inicial
            total,
            shippingAddress,
            paymentMethod,
        });


        // Guardar la orden en la base de datos
        await order.save();

        for (const item of cart.products) {
            try {
                const product = await Product.findById(item.productId);
                console.log("Product:", product);

                const orderDetail = new OrderDetail({
                    orderId: order._id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price, // Precio al momento de la compra
                });

                await orderDetail.save();
                console.log("OrderDetail guardado:", orderDetail);
            } catch (err) {
                console.error("Error al guardar OrderDetail:", err);
            }
        }

        // Reducir el stock de los productos vendidos
        for (const item of cart.products) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }

        // Vaciar el carrito del usuario
        await Cart.findByIdAndDelete(cart._id);

        // Responder con la orden creada
        res.status(201).json({ success: true, msg: "Orden creada exitosamente", order });

    } catch (err) {
        console.error("Error al crear la orden:", err);
        res.status(500).json({ success: false, msg: "Error al crear la orden" });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        // Obtener las órdenes del usuario
        const orders = await Order.find({ userId });

        // Obtener los detalles de los productos para cada orden
        const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
                const orderDetails = await OrderDetail.find({ orderId: order._id }).populate('productId');
                console.log(orderDetails)
                return {
                    ...order.toObject(), // Convertir el documento de Mongoose a un objeto plano
                    products: orderDetails.map(detail => ({
                        productId: detail.productId,
                        quantity: detail.quantity,
                        price: detail.price,
                    })),
                };
            })
        );

        res.status(200).json({ success: true, orders: ordersWithDetails });
    } catch (err) {
        console.error("Error al obtener las órdenes del usuario:", err);
        res.status(500).json({ success: false, msg: "Error al obtener las órdenes del usuario" });
    }
};

export { createOrder, getUserOrders };