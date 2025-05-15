import BannerCategory from '../models/BannerCategory.js';

// GET /api/banners
export const getBannerCategories = async (req, res) => {
  const cats = await BannerCategory.find({});
  res.json(cats);
};

// POST /api/banners
export const createBannerCategory = async (req, res) => {
  const { name } = req.body;
  const exists = await BannerCategory.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Category already exists' });
  const cat = await BannerCategory.create({ name, banners: [] });
  res.status(201).json(cat);
};

// PUT /api/banners/:id
export const updateBannerCategory = async (req, res) => {
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  cat.name = req.body.name || cat.name;
  await cat.save();
  res.json(cat);
};

// DELETE /api/banners/:id
export const deleteBannerCategory = async (req, res) => {
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  await cat.remove();
  res.json({ message: 'Category removed' });
};

// POST /api/banners/:id/banners
export const addBanner = async (req, res) => {
  const { name, imageUrl, link } = req.body;
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  cat.banners.push({ name, imageUrl, link });
  await cat.save();
  res.status(201).json(cat);
};

// DELETE /api/banners/:id/banners/:bid
export const removeBanner = async (req, res) => {
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  cat.banners.id(req.params.bid)?.remove();
  await cat.save();
  res.json(cat);
};