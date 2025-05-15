import YoutubeCategory from '../models/YoutubeCategory.js';

// GET /api/youtube
export const getCategories = async (req, res) => {
  const cats = await YoutubeCategory.find({});
  res.json(cats);
};

// POST /api/youtube
export const createCategory = async (req, res) => {
  const { name } = req.body;
  const exists = await YoutubeCategory.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Category already exists' });
  const cat = await YoutubeCategory.create({ name, videos: [] });
  res.status(201).json(cat);
};

// PUT /api/youtube/:id
export const updateCategory = async (req, res) => {
  const cat = await YoutubeCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  cat.name = req.body.name || cat.name;
  await cat.save();
  res.json(cat);
};

// DELETE /api/youtube/:id
export const deleteCategory = async (req, res) => {
  const cat = await YoutubeCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  await cat.remove();
  res.json({ message: 'Category removed' });
};

// POST /api/youtube/:id/videos
export const addVideo = async (req, res) => {
  const { name, url, description } = req.body;
  const cat = await YoutubeCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  cat.videos.push({ name, url, description });
  await cat.save();
  res.status(201).json(cat);
};

// DELETE /api/youtube/:id/videos/:vid
export const removeVideo = async (req, res) => {
  const cat = await YoutubeCategory.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  cat.videos.id(req.params.vid)?.remove();
  await cat.save();
  res.json(cat);
};