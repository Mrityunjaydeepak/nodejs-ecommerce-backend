// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  productNumber:   { type: String, required: true, unique: true },
  description:     { type: String },
  subcategory:     { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  available:       { type: Boolean, default: true },
  mrp:             { type: Number, required: true },
  images:          [{ type: String }],
  variations:      [{ color: String }],
  features:        [{ type: String }],
  optionalSpecifications: [{ type: String }],
  projects:        [{ type: String }],
  combinations:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
