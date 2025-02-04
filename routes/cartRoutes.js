import express from 'express';
import { addToCart, removeFromCart, clearCart, removeProductFromCart, loadCart } from '../controllers/cartController.js';
import { checkAuth} from '../middleware/authMiddleware.js';

const cartRoutes = express.Router();


cartRoutes.get('/', checkAuth, loadCart);
cartRoutes.post('/', checkAuth, addToCart);
cartRoutes.patch('/:productId', checkAuth, removeFromCart);
cartRoutes.delete('/', checkAuth, clearCart);
cartRoutes.delete('/:productId', checkAuth, removeProductFromCart);

export { cartRoutes };
