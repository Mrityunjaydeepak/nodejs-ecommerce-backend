import Product from '../models/Product.js';
import Subcategory from '../models/Subcategory.js';
import Favourite from '../models/Favourite.js';
import Enquiry from '../models/Enquiry.js';

// GET /api/products?categoryId=…&subcategoryId=…&page=1&limit=10
export const getProducts = async (req, res) => {
  const { categoryId, subcategoryId, page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (categoryId) {
    const subs = await Subcategory.find({ category: categoryId }).select('_id');
    filter.subcategory = { $in: subs.map(s => s._id) };
  }

  if (subcategoryId) {
    filter.subcategory = subcategoryId;
  }

  const total = await Product.countDocuments(filter);

  let favIds = [];
  let enquiryIds = [];

  if (req.user?._id) {
    const [favs, enqs] = await Promise.all([
      Favourite.find({ user: req.user._id }).select('product'),
      Enquiry.find({ user: req.user._id }).select('product'),
    ]);
    favIds = favs.map(f => f.product.toString());
    enquiryIds = enqs.map(e => e.product.toString());
  }

  const products = await Product.find(filter)
    .populate('subcategory', 'name')
    .populate('combinations', 'name')
    .skip(skip)
    .limit(limitNum);

  const data = products.map(prod => {
    const obj = prod.toObject();
    obj.isFavourite = favIds.includes(prod._id.toString());
    obj.isEnquired = enquiryIds.includes(prod._id.toString());
    return obj;
  });

  res.json({
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    limit: limitNum,
    data,
  });
};

// GET /api/products/:id
export const getProductDetails = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('subcategory', 'name')
    .populate('combinations', 'name');

  if (!product) return res.status(404).json({ message: 'Product not found' });

  let isFavourite = false;
  let isEnquired = false;

  if (req.user?._id) {
    const [fav, eq] = await Promise.all([
      Favourite.findOne({ user: req.user._id, product: product._id }),
      Enquiry.findOne({ user: req.user._id, product: product._id }),
    ]);
    isFavourite = !!fav;
    isEnquired = !!eq;
  }

  const obj = product.toObject();
  obj.isFavourite = isFavourite;
  obj.isEnquired = isEnquired;

  res.json(obj);
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

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  await product.remove();
  res.json({ message: 'Product removed' });
};

// GET /api/products/search?q=term&page=1&limit=10
export const searchProducts = async (req, res) => {
  const { q = '', categoryId, subcategoryId, page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ],
  };

  if (categoryId) {
    const subs = await Subcategory.find({ category: categoryId }).select('_id');
    filter.subcategory = { $in: subs.map(s => s._id) };
  }

  if (subcategoryId) {
    filter.subcategory = subcategoryId;
  }

  const total = await Product.countDocuments(filter);

  let favIds = [];
  let enquiryIds = [];

  if (req.user?._id) {
    const [favs, enqs] = await Promise.all([
      Favourite.find({ user: req.user._id }).select('product'),
      Enquiry.find({ user: req.user._id }).select('product'),
    ]);
    favIds = favs.map(f => f.product.toString());
    enquiryIds = enqs.map(e => e.product.toString());
  }

  const products = await Product.find(filter)
    .populate('subcategory', 'name')
    .populate('combinations', 'name')
    .skip(skip)
    .limit(limitNum);

  const data = products.map(prod => {
    const obj = prod.toObject();
    obj.isFavourite = favIds.includes(prod._id.toString());
    obj.isEnquired = enquiryIds.includes(prod._id.toString());
    return obj;
  });

  res.json({
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    limit: limitNum,
    data,
  });
};
