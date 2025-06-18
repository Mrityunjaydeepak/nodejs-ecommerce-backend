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

// GET /api/products/search?q=…       → searchProducts
router.get('/search', searchProducts);

// GET  /api/products                → getProducts
// POST /api/products                → createProduct
router
  .route('/')
  .get(getProducts)
  .post(protect, createProduct);

// GET    /api/products/:id          → getProductDetails
// PUT    /api/products/:id          → updateProduct
// DELETE /api/products/:id          → deleteProduct
router
  .route('/:id')
  .get(getProductDetails)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
