import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetOverview
} from '../controllers/budgetController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Budget routes
router.get('/', getBudgets);                      // GET /api/v1/budgets
router.post('/', createBudget);                   // POST /api/v1/budgets
router.get('/overview', getBudgetOverview);       // GET /api/v1/budgets/overview
router.put('/:budgetId', updateBudget);           // PUT /api/v1/budgets/:budgetId
router.delete('/:budgetId', deleteBudget);        // DELETE /api/v1/budgets/:budgetId

export default router;
