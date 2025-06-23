import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  searchProducts,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// search can stay public if you like:
// GET /api/products/search?q=…
router.get('/search', searchProducts);

// now require login for listing + detail views:
router
  .route('/')
  .get(protect, getProducts)         // ← added protect here
  .post(protect, createProduct);

router
  .route('/:id')
  .get(protect, getProductDetails)   // ← added protect here
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
