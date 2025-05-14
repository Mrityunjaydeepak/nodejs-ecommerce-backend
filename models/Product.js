// models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productNumber: { type: String, required: true, unique: true },
  description: { type: String },                           // 📄 new
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  available: { type: Boolean, default: true },
  mrp:       { type: Number, required: true },
  image:     { type: String },

  variations: [                                           // 🎨 new
    { color: String }
  ],
  features: [{ type: String }],                          // ✅ new
  optionalSpecifications: [{ type: String }],            // ⚙️ new
  projects: [{ type: String }],                          // 📁 new
  combinations: [                                        // 🔗 new
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ],
}, {
  timestamps: true
});

export default mongoose.model('Product', ProductSchema);
