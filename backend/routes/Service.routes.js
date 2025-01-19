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

const {authMiddleware} = require("../middleware/authmiddleware");
const {isAdminMiddleware} = require("../middleware/adminmiddleware")

router.get('/:id', getServiceById);

router.post('/', authMiddleware, createService); // Create new service
router.put('/:id', authMiddleware, updateService); // Update service
router.get('/artist/:artistId', authMiddleware, getServicesByArtist); // Get services by artist
router.delete('/:id', authMiddleware, deleteService); // Delete service
router.get('/', authMiddleware, isAdminMiddleware, getAllServices); // Get all services

module.exports = router;
