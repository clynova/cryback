import express from 'express'
import { categorias, crearCategoria, modificarCategoria, eliminarCategoria } from '../controllers/categoryController.js';
import { validateCategoryRegistration, validateCategoryModificar, validateCategoryID } from '../middleware/validators/categoryValidators.js';
const categoryRoutes = express.Router();

categoryRoutes.get('/', categorias)
categoryRoutes.post('/', validateCategoryRegistration, crearCategoria)
categoryRoutes.put('/', validateCategoryModificar, modificarCategoria)
categoryRoutes.delete('/', validateCategoryID, eliminarCategoria)


export { categoryRoutes }
