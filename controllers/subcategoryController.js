import Subcategory from '../models/Subcategory.js';

// GET /api/subcategories
// Returns all subcategories, populating both category and parent (if any)
export const getSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find({})
    .populate('category', 'name')
    .populate('parent', 'name');
  res.json(subcategories);
};

// POST /api/subcategories
// Accepts { name, category, image, parent? }
export const createSubcategory = async (req, res) => {
  const { name, category, image, parent } = req.body;
  const subcategory = new Subcategory({
    name,
    category,
    image,
    parent: parent || null,   // if parent not provided, store null
  });
  const created = await subcategory.save();
  // populate before sending back
  await created.populate('category', 'name').populate('parent', 'name').execPopulate();
  res.status(200).json(created);
};

// PUT /api/subcategories/:id
export const updateSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  if (!subcategory) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }
  subcategory.name     = req.body.name     ?? subcategory.name;
  subcategory.category = req.body.category ?? subcategory.category;
  subcategory.image    = req.body.image    ?? subcategory.image;
  // allow clearing parent by sending parent: null
  if (req.body.hasOwnProperty('parent')) {
    subcategory.parent = req.body.parent || null;
  }
  const updated = await subcategory.save();
  await updated.populate('category', 'name').populate('parent', 'name').execPopulate();
  res.json(updated);
};

// DELETE /api/subcategories/:id
export const deleteSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  if (!subcategory) {
    return res.status(404).json({ message: 'Subcategory not found' });
  }
  await subcategory.remove();
  res.json({ message: 'Subcategory removed' });
};
