import Catalogue from '../models/Catalogue.js';


export const getCatalogues = async (req, res) => {
  const catalogues = await Catalogue.find({}).populate('type');
  res.json(catalogues);
};

export const createCatalogue = async (req, res) => {
  // req.body.name from text field
  // req.file.path from multer
  const { name } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'PDF is required' });
  }
  const pdfPath = req.file.path;  // e.g. 'uploads/catalogues/1617901234567.pdf'
  const catalogue = await Catalogue.create({ name, pdf: pdfPath });
  // return just the generated id
  res.status(201).json({ id: catalogue._id });
};



