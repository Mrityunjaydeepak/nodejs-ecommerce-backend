import Catalogue from '../models/Catalogue.js';

// GET /api/catalogues
// Returns all catalogues with their types populated
export const getCatalogues = async (req, res) => {
  const catalogues = await Catalogue.find({})
    .populate('type', 'name');
  res.json(catalogues);
};

// GET /api/catalogues/type/:typeId
// Returns all catalogues for a specific catalogue type/category
export const getCataloguesByType = async (req, res) => {
  const { typeId } = req.params;
  const catalogues = await Catalogue.find({ type: typeId })
    .populate('type', 'name');
  res.json(catalogues);
};

// POST /api/catalogues
// Create a new catalogue with optional initial PDFs
// Expects JSON: { name: string, type: ObjectId, pdfs: [{ name, url, description? }] }
export const createCatalogue = async (req, res) => {
  const { name, type, pdfs = [] } = req.body;

  if (!name || !type) {
    return res
      .status(400)
      .json({ message: 'Catalogue name and type are required' });
  }

  const newCatalogue = await Catalogue.create({ name, type, pdfs });

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

// POST /api/catalogues/:id/pdfs
// Add a new PDF to a catalogue
// Expects: { name, url, description? }
export const addPdf = async (req, res) => {
  const { id } = req.params;
  const { name, url, description } = req.body;

  if (!name || !url) {
    return res.status(400).json({ message: 'PDF name and URL are required' });
  }

  const catalogue = await Catalogue.findById(id);
  if (!catalogue) {
    return res.status(404).json({ message: 'Catalogue not found' });
  }

  catalogue.pdfs.push({ name, url, description });
  await catalogue.save();

  const updated = await Catalogue.findById(id).populate('type', 'name');
  res.status(200).json(updated);
};

// DELETE /api/catalogues/:id/pdfs/:pdfId
// Remove a specific PDF from a catalogue
export const removePdf = async (req, res) => {
  const { id, pdfId } = req.params;

  const catalogue = await Catalogue.findById(id);
  if (!catalogue) {
    return res.status(404).json({ message: 'Catalogue not found' });
  }

  catalogue.pdfs = catalogue.pdfs.filter((pdf) => pdf._id.toString() !== pdfId);
  await catalogue.save();

  const updated = await Catalogue.findById(id).populate('type', 'name');
  res.status(200).json(updated);
};
