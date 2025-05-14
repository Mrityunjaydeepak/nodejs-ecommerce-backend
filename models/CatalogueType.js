import mongoose from 'mongoose';

const CatalogueTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('CatalogueType', CatalogueTypeSchema);