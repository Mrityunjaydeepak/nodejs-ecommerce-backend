import multer from 'multer';
import path from 'path';

// Ensure this folder exists (or create it at runtime)
const UPLOAD_DIR = 'uploads/catalogues/';

// Configure disk storage for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // preserve .pdf extension
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

// Only accept PDF mime type
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Export the configured multer instance
export const uploadPdf = multer({ storage, fileFilter });
