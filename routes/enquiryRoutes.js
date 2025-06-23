// routes/enquiryRoutes.js

import express from 'express';
import cors from 'cors';
import { protect } from '../middleware/auth.js';
import {
  getEnquiries,
  addEnquiry,
  removeEnquiry
} from '../controllers/enquiryController.js';

const router = express.Router();

// Apply CORS just as you do globally
router.use(cors());
router.options('*', cors());

// Require authentication for all enquiry routes
router.use(protect);

// GET    /api/enquiries        → getEnquiries
// POST   /api/enquiries        → addEnquiry
// DELETE /api/enquiries/:id    → removeEnquiry
router
  .route('/')
  .get(getEnquiries)
  .post(addEnquiry);

router
  .route('/:id')
  .delete(removeEnquiry);

export default router;
