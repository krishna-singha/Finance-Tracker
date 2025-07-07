import express from 'express';
import {
  signup,
  login,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Authentication routes (no auth middleware needed)
router.post('/auth/signup', signup);               // POST /api/v1/users/auth/signup
router.post('/auth/login', login);                 // POST /api/v1/users/auth/login

// Protected routes (require authentication)
router.use(authMiddleware); // Apply auth middleware to routes below
router.get('/profile', getUserProfile);           // GET /api/v1/users/profile
router.put('/profile', updateUserProfile);        // PUT /api/v1/users/profile

export default router;
