import express from 'express';
import { getCatalogueTypes, createCatalogueType } from '../controllers/catalogueTypeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(getCatalogueTypes).post(protect, createCatalogueType);

export default router;