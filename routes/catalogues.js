// routes/catalogues.js
import express from 'express';
import {
  getCatalogues,
  createCatalogue,
  deleteCatalogue,
  getCataloguesByType
} from '../controllers/catalogueController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET all catalogues
// POST a new catalogue (expects { name, pdf: "<PDF_URL>" } in JSON body)
router
  .route('/')
  .get(getCatalogues)
  .post(protect, adminOnly, createCatalogue);

  router.route('/type/:typeId')
  .get(getCataloguesByType);
// DELETE a catalogue by ID
router
  .route('/:id')
  .delete(protect, adminOnly, deleteCatalogue);

export default router;
