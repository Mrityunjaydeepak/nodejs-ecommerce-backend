// controllers/productController.js
import Product from '../models/Product.js';

// GET /api/products
export const getProducts = async (req, res) => {
  const products = await Product.find({})
    .populate('subcategory', 'name')
    .populate('combinations', 'name');
  res.json(products);
};

// POST /api/products
export const createProduct = async (req, res) => {
  const {
    name,
    productNumber,
    description,
    subcategory,
    available,
    mrp,
    images,
    variations,             // array of { color }
    features,               // array of strings
    optionalSpecifications, // array of strings
    projects,               // array of strings
    combinations            // array of Product _ids
  } = req.body;

  const product = new Product({
    name,
    productNumber,
    description,
    subcategory,
    available,
    mrp,
    images,
    variations,
    features,
    optionalSpecifications,
    projects,
    combinations
  });

  const created = await product.save();

  // re-fetch with populations
  const populated = await Product.findById(created._id)
    .populate('subcategory', 'name')
    .populate('combinations', 'name');

  res.status(201).json(populated);
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // only overwrite if provided
  const fields = [
    'name',
    'productNumber',
    'description',
    'subcategory',
    'available',
    'mrp',
    'images',
    'variations',
    'features',
    'optionalSpecifications',
    'projects',
    'combinations'
  ];
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updated = await product.save();
  const populated = await Product.findById(updated._id)
    .populate('subcategory', 'name')
    .populate('combinations', 'name');

  res.json(populated);
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.remove();
  res.json({ message: 'Product removed' });
};
