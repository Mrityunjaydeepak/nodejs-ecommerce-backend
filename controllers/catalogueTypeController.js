import CatalogueType from '../models/CatalogueType.js';

export const getCatalogueTypes = async (req, res) => {
  const types = await CatalogueType.find({});
  res.json(types);
};

export const createCatalogueType = async (req, res) => {
  const { name } = req.body;
  const type = new CatalogueType({ name });
  const createdType = await type.save();
  res.status(201).json(createdType);
};