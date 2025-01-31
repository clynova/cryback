import express from 'express'
import { categories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { validateCategoryRegistration, validateCategoryModificar, validateCategoryID } from '../middleware/validators/categoryValidators.js';
import { checkAuth, checkRole } from '../middleware/authMiddleware.js';
const categoryRoutes = express.Router();

categoryRoutes.get('/', categories)
categoryRoutes.post('/', checkAuth, checkRole('admin'), validateCategoryRegistration, createCategory)
categoryRoutes.put('/',  checkAuth, checkRole('admin'), validateCategoryModificar, updateCategory)
categoryRoutes.delete('/', checkAuth, checkRole('admin'), validateCategoryID, deleteCategory)


export { categoryRoutes }
