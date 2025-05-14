import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productNumber: { type: String, required: true, unique: true },
  available: { type: Boolean, default: true },
  mrp: { type: Number, required: true },
  image: { type: String },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);