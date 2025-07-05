// routes/catalogues.js
import express from 'express';
import {
  getCatalogues,
  createCatalogue,
  deleteCatalogue,
  updateCatalogue,    // ← import the new controller
} from '../controllers/catalogueController.js';

const router = express.Router();

// GET all catalogues
router.get('/', getCatalogues);

// POST create new catalogue
router.post('/', createCatalogue);

// PUT update an existing catalogue by ID
router.put('/:id', updateCatalogue);

// DELETE a catalogue by ID
router.delete('/:id', deleteCatalogue);

export default router;
