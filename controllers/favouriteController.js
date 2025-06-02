import Favourite from '../models/Favourite.js';

// GET /api/favourites
export const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id })
      .populate('product', 'name mrp images');
    res.json(favourites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/favourites
export const addFavourite = async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const exists = await Favourite.findOne({ user: req.user._id, product });
    if (exists) {
      return res.status(400).json({ message: 'Already in favourites' });
    }

    const favourite = new Favourite({ user: req.user._id, product });
    const created = await favourite.save();

    const populated = await Favourite.findById(created._id)
      .populate('product', 'name mrp images');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/favourites/:id
export const removeFavourite = async (req, res) => {
  try {
    const fav = await Favourite.findById(req.params.id);
    if (!fav) {
      return res.status(404).json({ message: 'Favourite not found' });
    }

    if (!fav.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to remove this favourite' });
    }

    await fav.remove();
    res.json({ message: 'Removed from favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
