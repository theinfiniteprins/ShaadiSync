const express = require('express');
const router = express.Router();
const {
  createArtistType,
  getAllArtistTypes,
  getArtistTypeById,
  updateArtistType,
  deleteArtistType,
} = require('../controllers/ArtistType.controller');

const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.post('/', authMiddleware, isAdminMiddleware, createArtistType); // Create artist type
router.get('/', getAllArtistTypes); // Get all artist types
router.get('/:id', getArtistTypeById); // Get artist type by ID
router.put('/:id', authMiddleware, isAdminMiddleware, updateArtistType); // Update artist type
router.delete('/:id', authMiddleware, isAdminMiddleware, deleteArtistType); // Delete artist type

module.exports = router;
