import { Order } from '../models/Order.js';
import { OrderDetail } from '../models/OrderDetail.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { validationResult } from 'express-validator';
import { ShippingMethod } from "../models/ShippingMethod.js";

const createOrder = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, msg: "Errores de validación", errors: errors.array() });
        }
        const userId = req.user._id;
        const { shippingAddress, paymentMethod, shippingMethodId } = req.body;

        // Validar el método de pago solo si se proporciona
        if (paymentMethod) {
            const validPaymentMethods = ["credit_card", "debit_card", "paypal"];
            if (!validPaymentMethods.includes(paymentMethod)) {
                return res.status(400).json({ success: false, msg: "Método de pago inválido" });
            }
        }

        console.log(shippingAddress);
        console.log("paymentMethod:", paymentMethod);

        // Validar la dirección de envío
        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
            return res.status(400).json({ success: false, msg: "Dirección de envío incompleta" });
        }

        // Verificar y obtener el método de envío
        const shippingMethod = await ShippingMethod.findById(shippingMethodId);
        if (!shippingMethod || !shippingMethod.active) {
            return res.status(404).json({ success: false, msg: "Método de envío no válido" });
        }

        // Calcular fecha estimada de entrega
        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + shippingMethod.estimatedDeliveryDays);

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
            total: total + shippingMethod.cost, // Actualizar el total incluyendo el costo de envío
            shippingAddress,
            ...(paymentMethod && { paymentMethod }), // Solo incluir si está presente
            shippingMethod: shippingMethod._id,
            shippingCost: shippingMethod.cost,
            estimatedDeliveryDate,
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

        // Poblar la información del método de envío en la respuesta
        await order.populate('shippingMethod');

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

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('shippingMethod')
            .populate('userId', 'name email');
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener las órdenes" });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id)
            .populate('shippingMethod')
            .populate('userId', 'name email');
        
        if (!order) {
            return res.status(404).json({ msg: "Orden no encontrada" });
        }
        
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener la orden" });
    }
};

const updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ msg: "Orden no encontrada" });
        }

        // Si se está actualizando el método de envío
        if (req.body.shippingMethodId) {
            const shippingMethod = await ShippingMethod.findById(req.body.shippingMethodId);
            if (!shippingMethod || !shippingMethod.active) {
                return res.status(404).json({ msg: "Método de envío no válido" });
            }

            const estimatedDeliveryDate = new Date();
            estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + shippingMethod.estimatedDeliveryDays);

            order.shippingMethod = shippingMethod._id;
            order.shippingCost = shippingMethod.cost;
            order.estimatedDeliveryDate = estimatedDeliveryDate;
            order.total = (order.total - order.shippingCost) + shippingMethod.cost;
        }

        // Actualizar otros campos si existen
        if (req.body.status) order.status = req.body.status;
        if (req.body.shippingAddress) order.shippingAddress = req.body.shippingAddress;
        if (req.body.paymentMethod) order.paymentMethod = req.body.paymentMethod;

        await order.save();
        await order.populate('shippingMethod');
        
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al actualizar la orden" });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ msg: "Orden no encontrada" });
        }

        await order.deleteOne();
        res.json({ msg: "Orden eliminada correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al eliminar la orden" });
    }
};

export { createOrder, getUserOrders, getOrders, getOrder, updateOrder, deleteOrder };