import Subcategory from '../models/Subcategory.js';

// GET /api/subcategories
export const getSubcategories = async (req, res) => {
  const { categoryId } = req.query;
  let query = {};

  // If they passed ?categoryId=… filter by that
  if (categoryId) {
    query.category = categoryId;
  }

  const subcategories = await Subcategory.find(query)
    .populate('category', 'name')
    .populate('parent', 'name');

  res.json(subcategories);
};

// POST /api/subcategories
export const createSubcategory = async (req, res) => {
  const { name, category, image, parent } = req.body;
  const subcategory = new Subcategory({
    name,
    category,
    image,
    parent: parent || null,
  });

  // Save the new subcategory
  const created = await subcategory.save();

  // Re-query (with populate) before sending response
  const populated = await Subcategory.findById(created._id)
    .populate('category', 'name')
    .populate('parent', 'name');

  res.status(201).json(populated);
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
  if (req.body.hasOwnProperty('parent')) {
    subcategory.parent = req.body.parent || null;
  }

  const updated = await subcategory.save();
  const populated = await Subcategory.findById(updated._id)
    .populate('category', 'name')
    .populate('parent', 'name');

  res.json(populated);
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
