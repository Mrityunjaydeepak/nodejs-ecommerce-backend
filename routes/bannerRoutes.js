// routes/banners.js
import express from 'express';
import {
  getBannerCategories,
  createBannerCategory,
  updateBannerCategory,
  deleteBannerCategory,
  addBanner,
  updateBanner,
  removeBanner,
  getAllBanners 
} from '../controllers/bannerController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// /api/banners
router
  .route('/')
  .get(getBannerCategories)
  .post(protect, adminOnly, createBannerCategory);



router
  .route('/all')
  .get(getAllBanners);
// /api/banners/:id
router
  .route('/:id')
  .put(protect, adminOnly, updateBannerCategory)
  .delete(protect, adminOnly, deleteBannerCategory);

// /api/banners/:id/banners
router
  .route('/:id/banners')
  .post(protect, adminOnly, addBanner);

// /api/banners/:id/banners/:bid
router
  .route('/:id/banners/:bid')
  .put(protect, adminOnly, updateBanner)    // ← new
  .delete(protect, adminOnly, removeBanner);

export default router;
