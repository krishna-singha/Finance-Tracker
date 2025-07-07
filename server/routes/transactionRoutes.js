import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary
} from '../controllers/transactionController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Transaction routes
router.get('/', getTransactions);                    // GET /api/v1/transactions
router.post('/', createTransaction);                 // POST /api/v1/transactions
router.get('/summary', getTransactionSummary);       // GET /api/v1/transactions/summary
router.put('/:transactionId', updateTransaction);    // PUT /api/v1/transactions/:transactionId
router.delete('/:transactionId', deleteTransaction); // DELETE /api/v1/transactions/:transactionId

export default router;
