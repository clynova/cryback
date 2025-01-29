import express from 'express'
import { productos, crearProducto, modificarProducto, eliminarProducto } from '../controllers/productController.js';
import { validateProductRegistration, validateProductModificar, validateProductID } from '../middleware/validators/productValidators.js';
const productRoutes = express.Router();

productRoutes.get('/', productos)
productRoutes.post('/', validateProductRegistration, crearProducto)
productRoutes.put('/', validateProductModificar, modificarProducto)
productRoutes.delete('/:_id', validateProductID, eliminarProducto);


export { productRoutes }
