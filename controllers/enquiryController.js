import Enquiry from '../models/Enquiry.js';

// GET /api/enquiries
// Return all enquiries for the logged-in user
export const getEnquiries = async (req, res) => {
  const list = await Enquiry
    .find({ user: req.user._id })
    .populate('product', 'name mrp images');
  res.json(list);
};

// POST /api/enquiries
// Create a new enquiry for a product
export const addEnquiry = async (req, res) => {
  const { productId, message } = req.body;

  // Prevent duplicate enquiries
  const exists = await Enquiry.findOne({ user: req.user._id, product: productId });
  if (exists) {
    return res.status(400).json({ message: 'Already enquired about this product' });
  }

  const e = new Enquiry({ user: req.user._id, product: productId, message });
  const created = await e.save();

  // Return populated enquiry
  const pop = await Enquiry.findById(created._id)
    .populate('product', 'name mrp images');
  res.status(201).json(pop);
};

// DELETE /api/enquiries/:id
// Remove an enquiry by its ID for the logged-in user
export const removeEnquiry = async (req, res) => {
  const { id } = req.params;
  const enquiry = await Enquiry.findOne({ _id: id, user: req.user._id });
  if (!enquiry) {
    return res.status(404).json({ message: 'Enquiry not found' });
  }

  await enquiry.remove();
  res.json({ message: 'Enquiry removed' });
};