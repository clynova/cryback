import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController.js';
import { checkAuth, checkTokenBlacklist } from '../middleware/authMiddleware.js';
import { validateOrder } from '../middleware/validators/orderValidators.js';

const orderRoutes = express.Router();

orderRoutes.post('/', checkAuth, checkTokenBlacklist, validateOrder, createOrder);
orderRoutes.get('/', checkAuth, checkTokenBlacklist, getUserOrders);

export { orderRoutes };
