import mongoose from 'mongoose';

const CatalogueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  pdf: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Catalogue', CatalogueSchema);
