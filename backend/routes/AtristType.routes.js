const express = require('express');
const router = express.Router();
const {
  createArtistType,
  getAllArtistTypes,
  getArtistTypeById,
  updateArtistType,
  deleteArtistType,
} = require('../controllers/ArtistType.controller');

router.post('/', createArtistType); // Create artist type
router.get('/', getAllArtistTypes); // Get all artist types
router.get('/:id', getArtistTypeById); // Get artist type by ID
router.put('/:id', updateArtistType); // Update artist type
router.delete('/:id', deleteArtistType); // Delete artist type

module.exports = router;
