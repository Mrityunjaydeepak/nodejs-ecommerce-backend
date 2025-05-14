import Subcategory from '../models/Subcategory.js';

export const getSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find({}).populate('category');
  res.json(subcategories);
};

export const createSubcategory = async (req, res) => {
  const { name, category, image } = req.body;
  const subcategory = new Subcategory({ name, category, image });
  const createdSubcategory = await subcategory.save();
  res.status(201).json(createdSubcategory);
};

export const updateSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  if (subcategory) {
    subcategory.name = req.body.name || subcategory.name;
    subcategory.category = req.body.category || subcategory.category;
    subcategory.image = req.body.image || subcategory.image;
    const updatedSubcategory = await subcategory.save();
    res.json(updatedSubcategory);
  } else {
    res.status(404).json({ message: 'Subcategory not found' });
  }
};

export const deleteSubcategory = async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  if (subcategory) {
    await subcategory.remove();
    res.json({ message: 'Subcategory removed' });
  } else {
    res.status(404).json({ message: 'Subcategory not found' });
  }
};