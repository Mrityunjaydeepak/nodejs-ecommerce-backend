// routes/userRoutes.js
import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createUser } from '../controllers/userController.js';

const router = express.Router();

// only admins can create new users
router.post('/', protect, adminOnly, createUser);

export default router;
