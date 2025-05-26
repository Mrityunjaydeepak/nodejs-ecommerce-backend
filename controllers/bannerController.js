// controllers/bannerController.js

import BannerCategory from '../models/BannerCategory.js';

// GET /api/banners
export const getBannerCategories = async (req, res) => {
  const cats = await BannerCategory.find({});
  res.json(cats);
};


// controllers/bannerController.js


// GET /api/banners/all?page=1&limit=10
export const getAllBanners = async (req, res) => {
  // parse pagination params (defaults: page 1, 10 items/page)
  const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip  = (page - 1) * limit;

  // 1) count total banners
  const countResult = await BannerCategory.aggregate([
    { $unwind: '$banners' },
    { $count: 'total' }
  ]);
  const total = countResult[0]?.total || 0;

  // 2) pull out, skip & limit
  const data = await BannerCategory.aggregate([
    { $unwind: '$banners' },
    { $replaceRoot: { newRoot: '$banners' } },   // now each doc is a banner object
    { $skip: skip },
    { $limit: limit }
  ]);

  // return paged response
  res.json({
    total,                // total banners across all categories
    page,                 // current page
    pages: Math.ceil(total / limit),
    limit,  
    data                  // array of banner objects
  });
};

// POST /api/banners
export const createBannerCategory = async (req, res) => {
  const { name } = req.body;
  const exists = await BannerCategory.findOne({ name });
  if (exists) {
    return res.status(400).json({ message: 'Category already exists' });
  }
  const cat = await BannerCategory.create({ name, banners: [] });
  res.status(201).json(cat);
};

// PUT /api/banners/:id
export const updateBannerCategory = async (req, res) => {
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ message: 'Category not found' });
  }
  cat.name = req.body.name ?? cat.name;
  await cat.save();
  res.json(cat);
};

// DELETE /api/banners/:id
export const deleteBannerCategory = async (req, res) => {
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ message: 'Category not found' });
  }
  await cat.remove();
  res.json({ message: 'Category removed' });
};

// POST /api/banners/:id/banners
export const addBanner = async (req, res) => {
  const { name, imageUrl, link, description } = req.body;
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ message: 'Category not found' });
  }
  cat.banners.push({ name, imageUrl, link, description });
  await cat.save();
  res.status(201).json(cat);
};

// PUT /api/banners/:id/banners/:bid
export const updateBanner = async (req, res) => {
  const { name, imageUrl, link, description } = req.body;
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const banner = cat.banners.id(req.params.bid);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found' });
  }
  banner.name = name ?? banner.name;
  banner.imageUrl = imageUrl ?? banner.imageUrl;
  banner.link = link !== undefined ? link : banner.link;
  banner.description = description !== undefined ? description : banner.description;
  await cat.save();
  res.json(cat);
};

// DELETE /api/banners/:id/banners/:bid
export const removeBanner = async (req, res) => {
  const cat = await BannerCategory.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const banner = cat.banners.id(req.params.bid);
  if (!banner) {
    return res.status(404).json({ message: 'Banner not found' });
  }
  banner.remove();
  await cat.save();
  res.json(cat);
};
