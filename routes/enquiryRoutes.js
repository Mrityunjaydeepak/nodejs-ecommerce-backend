// routes/enquiryRoutes.js

import express from 'express';
import cors from 'cors';
import { protect } from '../middleware/auth.js';
import { getEnquiries, addEnquiry, removeEnquiry } from '../controllers/enquiryController.js';

const router = express.Router();

// 1) Mount CORS on this router exactly as you do globally for your other routes.
//    If you’re using the default cors() with no options elsewhere, do the same here:
router.use(cors());

// 2) Explicitly handle preflight for every path under /api/enquiries
//    (this makes sure ANY OPTIONS request gets a 200 + CORS headers)
router.options('*', cors());

// 3) Now define your protected endpoints
router.get('/',    protect, getEnquiries);
router.post('/',   protect, addEnquiry);
router.delete('/:id', protect, removeEnquiry);

export default router;
