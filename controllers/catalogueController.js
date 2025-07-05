// controllers/catalogueController.js
import Catalogue from '../models/Catalogue.js';

// GET /api/catalogues
// Get all catalogues
export const getCatalogues = async (req, res) => {
  try {
    const catalogues = await Catalogue.find({}, 'name pdf thumbnail description');
    res.json(catalogues);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/catalogues
// Create a new catalogue
export const createCatalogue = async (req, res) => {
  const { name, pdf, thumbnail, description } = req.body;

  if (!name || !pdf || !thumbnail) {
    return res.status(400).json({ message: 'Name, PDF, and thumbnail are required' });
  }

  try {
    const newCatalogue = await Catalogue.create({ name, pdf, thumbnail, description });
    res.status(201).json(newCatalogue);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create catalogue', error: err.message });
  }
};

// DELETE /api/catalogues/:id
// Delete a catalogue by ID
export const deleteCatalogue = async (req, res) => {
  try {
    const catalogue = await Catalogue.findById(req.params.id);
    if (!catalogue) {
      return res.status(404).json({ message: 'Catalogue not found' });
    }

    await catalogue.remove();
    res.json({ message: 'Catalogue removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete catalogue', error: err.message });
  }
};



// PUT /api/catalogues/:id
// Update a catalogue by ID
export const updateCatalogue = async (req, res) => {
  const { name, pdf, thumbnail, description } = req.body;

  // you can enforce required fields here if you like:
  if (!name || !pdf || !thumbnail) {
    return res.status(400).json({ message: 'Name, PDF, and thumbnail are required' });
  }

  try {
    const updated = await Catalogue.findByIdAndUpdate(
      req.params.id,
      { name, pdf, thumbnail, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Catalogue not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update catalogue', error: err.message });
  }
};
