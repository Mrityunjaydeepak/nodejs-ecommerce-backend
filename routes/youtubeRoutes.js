import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addVideo,
  removeVideo,
  getVideosByCategory
} from '../controllers/youtubeController.js';

const router = express.Router();

router.get('/', protect, adminOnly, getCategories);
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);
router.route('/:id/videos')
  .get(getVideosByCategory)  // <-- new endpoint
  .post(addVideo);
// manage videos
router.post('/:id/videos', protect, adminOnly, addVideo);
router.delete('/:id/videos/:vid', protect, adminOnly, removeVideo);

export default router;
