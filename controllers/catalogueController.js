// controllers/catalogueController.js
import Catalogue from '../models/Catalogue.js';

// GET /api/catalogues
// Returns all catalogues, with their types populated
export const getCatalogues = async (req, res) => {
  const catalogues = await Catalogue.find({})
    .populate('type', 'name');  // assuming your type model has a 'name' field
  res.json(catalogues);
};

// POST /api/catalogues
// Expects JSON: { name: string, pdf: string, type: ObjectId }
export const createCatalogue = async (req, res) => {
  const { name, pdf, type } = req.body;
  if (!name || !pdf || !type) {
    return res
      .status(400)
      .json({ message: 'Name, PDF URL, and type are all required' });
  }

  // Create and then re-query to populate
  const newCatalogue = await Catalogue.create({ name, pdf, type });
  const populated = await Catalogue.findById(newCatalogue._id)
    .populate('type', 'name');

  res.status(201).json(populated);
};

// DELETE /api/catalogues/:id
export const deleteCatalogue = async (req, res) => {
  const cat = await Catalogue.findById(req.params.id);
  if (!cat) {
    return res.status(404).json({ message: 'Catalogue not found' });
  }
  await cat.remove();
  res.json({ message: 'Catalogue removed' });
};
