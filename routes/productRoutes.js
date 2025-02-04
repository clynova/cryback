import express from 'express'
import { products, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { validateProductRegistration, validateProductModificar, validateProductID } from '../middleware/validators/productValidators.js';
import { checkAuth, checkRole, checkTokenBlacklist } from '../middleware/authMiddleware.js';

const productRoutes = express.Router();

productRoutes.get('/', products)
productRoutes.get('/:id', getProduct)
productRoutes.post('/', checkAuth, checkTokenBlacklist, checkRole('admin'), validateProductRegistration, createProduct)
productRoutes.put('/:_id', checkAuth, checkTokenBlacklist, checkRole('admin'), validateProductModificar, updateProduct)
productRoutes.delete('/:_id', checkAuth, checkTokenBlacklist, checkRole('admin'), validateProductID, deleteProduct);


export { productRoutes }
