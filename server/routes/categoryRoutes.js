import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Category routes
router.get('/', getCategories);                    // GET /api/v1/categories
router.post('/', createCategory);                  // POST /api/v1/categories
router.put('/:categoryId', updateCategory);        // PUT /api/v1/categories/:categoryId
router.delete('/:categoryId', deleteCategory);     // DELETE /api/v1/categories/:categoryId

export default router;
