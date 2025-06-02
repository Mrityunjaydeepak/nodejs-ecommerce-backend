import mongoose from 'mongoose';

// Define a subdocument schema for PDFs
const PdfSchema = new mongoose.Schema({
  name: { type: String, required: true },         // Display name for the PDF
  url: { type: String, required: true },          // URL to the PDF file
  description: { type: String },                  // Optional description
}, { _id: true }); // _id is true by default, included here for clarity

// Define the main catalogue category schema
const CatalogueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CatalogueType',
    required: true
  },
  pdfs: [PdfSchema] // Array of PDFs inside this catalogue
}, {
  timestamps: true
});

export default mongoose.model('Catalogue', CatalogueSchema);
