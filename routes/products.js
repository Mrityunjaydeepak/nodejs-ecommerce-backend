import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getProductDetails,searchProducts } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/search', searchProducts);
router.route('/').get(getProducts).post(protect, createProduct);
router.route('/:id').put(protect, updateProduct).delete(protect, deleteProduct);
router
  .route('/products/:id')        
  .get(getProductDetails);


export default router;