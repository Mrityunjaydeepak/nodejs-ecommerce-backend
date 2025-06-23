// routes/productRoutes.js
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
import { attachUser } from '../middleware/attachUser.js';

const router = express.Router();

// SEARCH: allow anon + logged-in
router.get('/search', attachUser, searchProducts);

// LIST & DETAIL: allow anon + logged-in
router
  .route('/')
  .get(attachUser, getProducts)
  .post(protect, createProduct);

router
  .route('/:id')
  .get(attachUser, getProductDetails)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
