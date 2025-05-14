import express from 'express';
import { getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from '../controllers/subcategoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(getSubcategories).post(protect, createSubcategory);
router.route('/:id').put(protect, updateSubcategory).delete(protect, deleteSubcategory);

export default router;