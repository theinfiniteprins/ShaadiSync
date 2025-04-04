const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByArtist,
  toggleServiceLiveStatus,
  getAllLiveServices,
  getServicesByCategory,
  getLatestServiceByArtist,
  getServicesByArtistId,
} = require('../controllers/Service.controller');

const { authMiddleware } = require("../middleware/authmiddleware");

// Public Routes
router.get('/live', getAllLiveServices); // Get all live services
router.get('/category/:category', getServicesByCategory); // Get services by category
router.get('/artist/getbyid', authMiddleware, getServicesByArtist); // Specific route - must come before /artist/:artistId
router.get('/artist/latestService', authMiddleware, getLatestServiceByArtist); // Specific route - must come before /artist/:artistId
router.get('/artist/:artistId', getServicesByArtistId); // Get services by artist ID

// Protected Routes (Require Authentication)
router.use(authMiddleware);

router.post('/', createService); // Create new service
router.put('/:id', updateService); // Update service
router.delete('/:id', deleteService); // Delete service
router.put('/toggle/:id', toggleServiceLiveStatus); // Toggle service live status
router.get('/', getAllServices); // Get all services (authenticated access)

// Dynamic Route - Must be at the bottom to prevent conflicts
router.get('/:id', getServiceById); // Get service by ID

module.exports = router;
