import Product from '../models/Product.js';
import Subcategory from '../models/Subcategory.js';
import Favourite from '../models/Favourite.js';
import Enquiry from '../models/Enquiry.js';

// GET /api/products?categoryId=…&subcategoryId=…&page=1&limit=10
export const getProducts = async (req, res) => {
  const { categoryId, subcategoryId, page = 1, limit = 10 } = req.query;

  // Normalize pagination parameters
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter object
  const filter = {};

  // If filtering by category, fetch its subcategory IDs
  if (categoryId) {
    const subs = await Subcategory.find({ category: categoryId }).select('_id');
    filter.subcategory = { $in: subs.map(s => s._id) };
  }

  // If filtering by subcategory directly, override filter
  if (subcategoryId) {
    filter.subcategory = subcategoryId;
  }

  // Count total matching products
  const total = await Product.countDocuments(filter);

  // Retrieve current user's favourite product IDs (if authenticated)
  let favIds = [];
  if (req.user && req.user._id) {
    const favs = await Favourite.find({ user: req.user._id }).select('product');
    favIds = favs.map(f => f.product.toString());
  }

  // Retrieve current user's enquired product IDs (if authenticated)
  let enquiryIds = [];
  if (req.user && req.user._id) {
    const enqs = await Enquiry.find({ user: req.user._id }).select('product');
    enquiryIds = enqs.map(e => e.product.toString());
  }

  // Fetch paginated products
  const products = await Product.find(filter)
    .populate('subcategory', 'name')
    .populate('combinations', 'name')
    .skip(skip)
    .limit(limitNum);

  // Append isFavourite and isEnquired flags
  const data = products.map(prod => {
    const obj = prod.toObject();
    obj.isFavourite = favIds.includes(prod._id.toString());
    obj.isEnquired = enquiryIds.includes(prod._id.toString());
    return obj;
  });

  // Return paginated response
  res.json({
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    limit: limitNum,
    data,
  });
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
    variations,
    features,
    optionalSpecifications,
    projects,
    combinations,
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
    combinations,
  });

  const created = await product.save();
  const populated = await Product.findById(created._id)
    .populate('subcategory', 'name')
    .populate('combinations', 'name');

  res.status(201).json(populated);
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

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
    'combinations',
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

// GET /api/products/:id
export const getProductDetails = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('subcategory', 'name')
    .populate('combinations', 'name');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Determine if the product is a favourite of the current user
  let isFavourite = false;
  if (req.user && req.user._id) {
    const fav = await Favourite.findOne({ user: req.user._id, product: product._id });
    isFavourite = !!fav;
  }

  // Determine if the product has been enquired by the current user
  let isEnquired = false;
  if (req.user && req.user._id) {
    const eq = await Enquiry.findOne({ user: req.user._id, product: product._id });
    isEnquired = !!eq;
  }

  const obj = product.toObject();
  obj.isFavourite = isFavourite;
  obj.isEnquired = isEnquired;

  res.json(obj);
};
// controllers/productController.js
// …existing imports and methods…

/**
 * GET /api/products/search?q=term&page=1&limit=10
 * Public: full-text search on name or description, paginated
 */
export const searchProducts = async (req, res) => {
  const { q = '', categoryId, subcategoryId, page = 1, limit = 10 } = req.query;
  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip     = (pageNum - 1) * limitNum;

  // Base text query
  const filter = {
    $or: [
      { name:        { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ]
  };

  // Optional: also filter by category/subcategory
  if (categoryId) {
    filter.subcategory = filter.subcategory || {};
    const subs = await Subcategory.find({ category: categoryId }).select('_id');
    filter.subcategory = { $in: subs.map(s => s._id) };
  }
  if (subcategoryId) {
    filter.subcategory = subcategoryId;
  }

  // Count & fetch
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('subcategory', 'name')
    .populate('combinations','name')
    .skip(skip)
    .limit(limitNum);

  res.json({
    total,
    page:  pageNum,
    pages: Math.ceil(total / limitNum),
    limit: limitNum,
    data:  products
  });
};


// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.remove();
  res.json({ message: 'Product removed' });
};
