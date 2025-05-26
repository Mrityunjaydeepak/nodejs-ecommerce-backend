import express from 'express';
import { getFavourites, addFavourite, removeFavourite } from '../controllers/favouriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/favourites
// Return all favourites for the logged-in user
router.get('/', protect, getFavourites);

// POST /api/favourites
// Add a product to favourites
router.post('/', protect, addFavourite);

// DELETE /api/favourites/:id
// Remove a favourite by its ID
router.delete('/:id', protect, removeFavourite);

export default router;
