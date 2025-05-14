import express from 'express';
import { getFavourites, addFavourite, removeFavourite } from '../controllers/favouriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/')
  .get(protect, getFavourites)
  .post(protect, addFavourite);
router.route('/:productId').delete(protect, removeFavourite);

export default router;