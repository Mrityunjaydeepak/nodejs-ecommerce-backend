// routes/catalogues.js
import express from 'express';
import {
  getCatalogues,
  getCataloguesByType,
  createCatalogue,
  deleteCatalogue
} from '../controllers/catalogueController.js';

const router = express.Router();

// GET /api/catalogues
router.get('/', getCatalogues);

// GET /api/catalogues/type/:typeId
router.get('/type/:typeId', getCataloguesByType);

// POST /api/catalogues
router.post('/', createCatalogue);

// DELETE /api/catalogues/:id
router.delete('/:id', deleteCatalogue);

export default router;
