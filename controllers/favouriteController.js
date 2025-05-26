import Favourite from '../models/Favourite.js';

// GET /api/favourites
// Return all favourites for the logged-in user
export const getFavourites = async (req, res) => {
  const favourites = await Favourite.find({ user: req.user._id })
    .populate('product', 'name mrp images');
  res.json(favourites);
};

// POST /api/favourites
// Add a product to favourites
export const addFavourite = async (req, res) => {
  const { productId } = req.body;
  const exists = await Favourite.findOne({ user: req.user._id, product: productId });
  if (exists) {
    return res.status(400).json({ message: 'Already in favourites' });
  }
  const favourite = new Favourite({ user: req.user._id, product: productId });
  const created = await favourite.save();
  const populated = await Favourite.findById(created._id)
    .populate('product', 'name mrp images');
  res.status(201).json(populated);
};

// DELETE /api/favourites/:id
// Remove a favourite by its ID
export const removeFavourite = async (req, res) => {
  const fav = await Favourite.findById(req.params.id);
  if (!fav) {
    return res.status(404).json({ message: 'Favourite not found' });
  }
  // Ensure the logged-in user owns this favourite
  if (!fav.user.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to remove this favourite' });
  }
  await fav.remove();
  res.json({ message: 'Removed from favourites' });
};