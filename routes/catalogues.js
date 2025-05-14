import express from 'express';
import { getCatalogues, createCatalogue } from '../controllers/catalogueController.js';
import { protect } from '../middleware/auth.js';
import { uploadPdf } from '../middleware/uploadPdf.js';


const router = express.Router();
router.route('/').get(getCatalogues).post(protect, createCatalogue);
router.post(
  '/', 
  protect, 
  uploadPdf.single('pdf'), 
  createCatalogue
);

export default router;