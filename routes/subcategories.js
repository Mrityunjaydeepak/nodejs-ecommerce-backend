// routes/subcategories.js
import express from 'express';
import {
  getSubcategories,
  getSubcategoriesTree,
  getSubcategorySubtree,   // ← new
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from '../controllers/subcategoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET all subcategories, POST to create
router.route('/')
  .get(getSubcategories)
  .post(protect, createSubcategory);

// GET full category tree
router.route('/tree')
  .get(getSubcategoriesTree);

// GET a specific subcategory’s subtree
router.route('/subtree')
  .get(getSubcategorySubtree);

// PUT to update & DELETE to remove by ID
router.route('/:id')
  .put(protect, updateSubcategory)
  .delete(protect, deleteSubcategory);

export default router;
