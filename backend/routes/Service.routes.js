const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByArtist,
} = require('../controllers/Service.controller');

router.post('/', createService); // Create new service
router.get('/', getAllServices); // Get all services
router.get('/:id', getServiceById); // Get service by ID
router.put('/:id', updateService); // Update service
router.delete('/:id', deleteService); // Delete service
router.get('/artist/:artistId', getServicesByArtist); // Get services by artist

module.exports = router;
