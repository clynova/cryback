import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController.js';
import { checkAuth } from '../middleware/authMiddleware.js';
import { validateOrder } from '../middleware/validators/orderValidators.js';

const orderRoutes = express.Router();

orderRoutes.post('/', checkAuth, validateOrder, createOrder);
orderRoutes.get('/', checkAuth, getUserOrders);

export { orderRoutes };
     