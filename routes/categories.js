import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory,  getCategoriesWithSubs, getAllSubcategories, getCategoriesTree } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(getCategories).post(protect, createCategory);
router.route('/:id').put(protect, updateCategory).delete(protect, deleteCategory);
router
  .route('/categories')
  .get(getCategoriesWithSubs)
  .post(createCategory);

  router.get('/tree', getCategoriesTree);
// get *all* subs for one category
router
  .route('/categories/:id/subcategories')
  .get(getAllSubcategories);

export default router;