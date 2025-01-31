import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const orderRoutes = express.Router();

orderRoutes.post('/', checkAuth, createOrder);
orderRoutes.get('/', checkAuth, getUserOrders);

export { orderRoutes };
