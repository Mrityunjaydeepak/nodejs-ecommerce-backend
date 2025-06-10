// src/controllers/favouriteController.js
import Favourite from '../models/Favourite.js';
import Product from '../models/Product.js';  // ← import Product

// GET /api/favourites
export const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id })
      .populate('product', 'name mrp images isFavourite');  // include isFavourite if you want
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

    // 1) Create the new Favourite document
    const favourite = new Favourite({ user: req.user._id, product });
    const created = await favourite.save();

    // 2) Mark the Product’s isFavourite = true
    await Product.findByIdAndUpdate(product, { isFavourite: true });

    // 3) Re‐fetch the populated favourite to return
    const populated = await Favourite.findById(created._id)
      .populate('product', 'name mrp images isFavourite');

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

    // 1) Remember which product we’re about to un‐favourite
    const productId = fav.product.toString();

    // 2) Remove the Favourite document
    await fav.remove();

    // 3) Mark that product’s isFavourite = false
    //    (if you wanted to be extra safe: check if there are any other favourites for the same product/
    //     but if you treat isFavourite as global “someone has favourited this product,” this is fine.)
    await Product.findByIdAndUpdate(productId, { isFavourite: false });

    res.json({ message: 'Removed from favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
