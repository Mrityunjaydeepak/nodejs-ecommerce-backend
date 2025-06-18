// routes/catalogues.js
import express from 'express';
import {
  getCatalogues,
  createCatalogue,
  deleteCatalogue
} from '../controllers/catalogueController.js';

const router = express.Router();

// GET all catalogues
router.get('/', getCatalogues);

// POST create new catalogue
router.post('/', createCatalogue);

// DELETE a catalogue by ID
router.delete('/:id', deleteCatalogue);

export default router;
