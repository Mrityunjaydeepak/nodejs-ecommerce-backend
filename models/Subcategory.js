import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  name:       { type: String, required: true },
  image:      { type: String },
  category:   { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  parent:     { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', default: null },  // ← new
}, { timestamps: true });

export default mongoose.model('Subcategory', SubcategorySchema);