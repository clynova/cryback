import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const orderRoutes = express.Router();

orderRoutes.post('/', checkAuth, createOrder);

export { orderRoutes };
