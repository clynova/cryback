import express from 'express'
import { categorias, crearCategoria, modificarCategoria, eliminarCategoria } from '../controllers/categoryController.js';
import { validateCategoryRegistration, validateCategoryModificar, validateCategoryID } from '../middleware/validators/categoryValidators.js';
import { checkAuth, checkRole } from '../middleware/authMiddleware.js';
const categoryRoutes = express.Router();

categoryRoutes.get('/', categorias)
categoryRoutes.post('/', checkAuth, checkRole('admin'), validateCategoryRegistration, crearCategoria)
categoryRoutes.put('/',  checkAuth, checkRole('admin'), validateCategoryModificar, modificarCategoria)
categoryRoutes.delete('/', checkAuth, checkRole('admin'), validateCategoryID, eliminarCategoria)


export { categoryRoutes }
