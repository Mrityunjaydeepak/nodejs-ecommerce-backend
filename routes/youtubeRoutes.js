import express from 'express';
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

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

router.route('/:id/videos')
  .get(getVideosByCategory)
  .post(addVideo);

router.delete('/:id/videos/:vid', removeVideo);

export default router;
