// routes/cartRoutes.js
import express from 'express';
import { addToCart } from '../controllers/cartController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const cartRoutes = express.Router();

cartRoutes.post('/', checkAuth, addToCart);

export { cartRoutes };