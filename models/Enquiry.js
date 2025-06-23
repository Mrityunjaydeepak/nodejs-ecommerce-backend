import mongoose from 'mongoose';

const customerDetailsSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  companyName: { type: String, default: '' },
  mobileNo:    { type: String, required: true },
  remarks:     { type: String, default: '' },
}, { _id: false });

const enquirySchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

  // nested group for all customer‐specific fields
  customerAdditionalDetails: {
    type: customerDetailsSchema,
    required: true
  },

  message:  { type: String },
  quantity: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('Enquiry', enquirySchema);
