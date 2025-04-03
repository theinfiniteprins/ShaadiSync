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

const {authMiddleware} = require("../middleware/authmiddleware");

router.get('/live', getAllLiveServices); // Get all services
router.get('/:id', getServiceById);
router.get('/artist/:artistId', getServicesByArtistId);

router.post('/', authMiddleware, createService); // Create new service
router.put('/:id', authMiddleware, updateService); // Update service
router.get('/artist/getbyid',authMiddleware, getServicesByArtist); // Get services by artist
router.get('/artist/latestService',authMiddleware, getLatestServiceByArtist); // Get services by artist
router.delete('/:id', authMiddleware, deleteService); // Delete service
router.get('/', authMiddleware, getAllServices); // Get all services
router.put('/toggle/:id', authMiddleware, toggleServiceLiveStatus); // Update service
router.get('/category/:category', getServicesByCategory);

module.exports = router;
