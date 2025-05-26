import express from 'express';
import { protect } from '../middleware/auth.js';
import { getEnquiries, addEnquiry } from '../controllers/enquiryController.js';

const router = express.Router();

// GET /api/enquiries        → list your enquiries
// POST /api/enquiries       → create a new one


/**
 * @route   GET /api/enquiries
 * @desc    Get all enquiries made by the authenticated user
 * @access  Protected
 */
router.get('/', protect, getEnquiries);

/**
 * @route   POST /api/enquiries
 * @desc    Send a new enquiry about a product
 * @access  Protected
 * @body    { productId: string, message?: string }
 */
router.post('/', protect, addEnquiry);



router
  .route('/')
  .get(protect, getEnquiries)
  .post(protect, addEnquiry);

export default router;
