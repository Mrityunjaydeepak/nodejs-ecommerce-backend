import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  message: { type: String },            // optional user message
}, { timestamps: true });

export default mongoose.model('Enquiry', enquirySchema);
