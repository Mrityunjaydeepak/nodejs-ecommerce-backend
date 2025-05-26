import Enquiry from '../models/Enquiry.js';

// GET /api/enquiries
// return all enquiries for the logged-in user
export const getEnquiries = async (req, res) => {
  const list = await Enquiry
    .find({ user: req.user._id })
    .populate('product', 'name mrp images');
  res.json(list);
};

// POST /api/enquiries
// create a new enquiry for a product
export const addEnquiry = async (req, res) => {
  const { productId, message } = req.body;

  // optional: prevent duplicates
  const exists = await Enquiry.findOne({ user: req.user._id, product: productId });
  if (exists) {
    return res.status(400).json({ message: 'Already enquired about this product' });
  }

  const e = new Enquiry({ user: req.user._id, product: productId, message });
  const created = await e.save();

  // return populated
  const pop = await Enquiry.findById(created._id)
    .populate('product', 'name mrp images');
  res.status(201).json(pop);
};
