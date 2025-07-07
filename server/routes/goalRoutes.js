import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getGoals,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalsSummary
} from '../controllers/goalController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Goal routes
router.get('/', getGoals);                          // GET /api/v1/goals
router.post('/', createGoal);                       // POST /api/v1/goals
router.get('/summary', getGoalsSummary);            // GET /api/v1/goals/summary
router.put('/:goalId', updateGoal);                 // PUT /api/v1/goals/:goalId
router.put('/:goalId/progress', updateGoalProgress); // PUT /api/v1/goals/:goalId/progress
router.delete('/:goalId', deleteGoal);              // DELETE /api/v1/goals/:goalId

export default router;
