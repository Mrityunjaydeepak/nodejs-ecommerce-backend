import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithSubs,
  getAllSubcategories,
  getCategorySubcategoryTree,
  getSubcategoryChildren,
  getSubcategoryDescendants
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getCategories).post(protect, createCategory);
router.route('/:id').put(protect, updateCategory).delete(protect, deleteCategory);

router.get('/with-subs', getCategoriesWithSubs); // optional simplification
router.get('/tree-with-subcategories', getCategorySubcategoryTree);
router.get('/:id/subcategories', getAllSubcategories); // if needed
router.get('/subcategories/:id/children',   getSubcategoryChildren);
router.get('/subcategories/:id/descendants',getSubcategoryDescendants);

export default router;
