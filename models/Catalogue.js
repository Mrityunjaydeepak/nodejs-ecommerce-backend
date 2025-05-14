import mongoose from 'mongoose';

const CatalogueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pdf:  { type: String, required: true },    // path to the uploaded file
}, { timestamps: true });

export default mongoose.model('Catalogue', CatalogueSchema);
