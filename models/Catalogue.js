// models/Catalogue.js
import mongoose from 'mongoose';

const CatalogueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    required: true,    // this is now the URL to your PDF
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogueType',
    required: true,    // each catalogue must belong to a type
  },
}, {
  timestamps: true,
});

export default mongoose.model('Catalogue', CatalogueSchema);
