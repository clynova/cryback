import express from 'express'
import { categories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { validateCategoryRegistration, validateCategoryModificar, validateCategoryID } from '../middleware/validators/categoryValidators.js';
import { checkAuth, checkRole, checkTokenBlacklist } from '../middleware/authMiddleware.js';
const categoryRoutes = express.Router();

categoryRoutes.get('/', categories)
categoryRoutes.post('/', checkAuth, checkTokenBlacklist, checkRole('admin'), validateCategoryRegistration, createCategory)
categoryRoutes.put('/',  checkAuth, checkTokenBlacklist, checkRole('admin'), validateCategoryModificar, updateCategory)
categoryRoutes.delete('/', checkAuth, checkTokenBlacklist, checkRole('admin'), validateCategoryID, deleteCategory)


export { categoryRoutes }
