import express from 'express'
import { productos, crearProducto, modificarProducto, eliminarProducto } from '../controllers/productController.js';
import { validateProductRegistration, validateProductModificar, validateProductID } from '../middleware/validators/productValidators.js';
import { checkAuth, checkRole } from '../middleware/authMiddleware.js';

const productRoutes = express.Router();

productRoutes.get('/', productos)
productRoutes.post('/', checkAuth, checkRole('admin'), validateProductRegistration, crearProducto)
productRoutes.put('/:_id', checkAuth, checkRole('admin'), validateProductModificar, modificarProducto)
productRoutes.delete('/:_id', checkAuth, checkRole('admin'), validateProductID, eliminarProducto);


export { productRoutes }
