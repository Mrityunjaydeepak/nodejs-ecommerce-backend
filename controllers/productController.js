import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  const products = await Product.find({}).populate('subcategory');
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, productNumber, available, mrp, image, subcategory } = req.body;
  const product = new Product({ name, productNumber, available, mrp, image, subcategory });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.productNumber = req.body.productNumber || product.productNumber;
    product.available = req.body.available ?? product.available;
    product.mrp = req.body.mrp ?? product.mrp;
    product.subcategory = req.body.subcategory || product.subcategory;
    product.image = req.body.image || product.image;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};