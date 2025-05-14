import Favourite from '../models/Favourite.js';

export const getFavourites = async (req, res) => {
  const favourites = await Favourite.find({ user: req.user._id }).populate('product');
  res.json(favourites);
};

export const addFavourite = async (req, res) => {
  const { productId } = req.body;
  const favExists = await Favourite.findOne({ user: req.user._id, product: productId });
  if (favExists) {
    return res.status(400).json({ message: 'Already in favourites' });
  }
  const favourite = new Favourite({ user: req.user._id, product: productId });
  const createdFav = await favourite.save();
  res.status(201).json(createdFav);
};

export const removeFavourite = async (req, res) => {
  const fav = await Favourite.findOne({ user: req.user._id, product: req.params.productId });
  if (fav) {
    await fav.remove();
    res.json({ message: 'Removed from favourites' });
  } else {
    res.status(404).json({ message: 'Favourite not found' });
  }
};