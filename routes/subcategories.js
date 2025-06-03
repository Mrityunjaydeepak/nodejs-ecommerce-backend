import express from 'express';
import { getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory,getSubcategoriesTree } from '../controllers/subcategoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(getSubcategories).post(protect, createSubcategory);
// GET flat list: /api/subcategories?categoryId=…
router.route('/').get(getSubcategories).post(protect, createSubcategory);

// NEW nested‐tree endpoint: /api/subcategories/tree?categoryId=…
router.route('/tree').get(getSubcategoriesTree);

router.route('/:id').put(protect, updateSubcategory).delete(protect, deleteSubcategory);

export default router;