import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getBannerCategories,
  createBannerCategory,
  updateBannerCategory,
  deleteBannerCategory,
  addBanner,
  removeBanner
} from '../controllers/bannerController.js';

const router = express.Router();

// Category endpoints
router.get('/', protect, adminOnly, getBannerCategories);
router.post('/', protect, adminOnly, createBannerCategory);
router.put('/:id', protect, adminOnly, updateBannerCategory);
router.delete('/:id', protect, adminOnly, deleteBannerCategory);

// Banner endpoints
router.post('/:id/banners', protect, adminOnly, addBanner);
router.delete('/:id/banners/:bid', protect, adminOnly, removeBanner);

export default router;
