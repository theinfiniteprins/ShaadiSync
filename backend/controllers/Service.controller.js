const Service = require('../models/Service.model');
const Artist = require('../models/Artist.model');

// 1. Create a new Service
const createService = async (req, res) => {
  try {
    const { artistId, name, price, description, photos, videos, isLive } = req.body;

    // Check if the artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Create the new service
    const newService = new Service({
      artistId,
      name,
      price,
      description,
      photos,
      videos,
      isLive,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all Services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('artistId', 'name email') // Populate artist details
      .exec();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get a Service by ID
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('artistId', 'name email') // Populate artist details
      .exec();

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update a Service
const updateService = async (req, res) => {
  try {
    const { name, price, description, photos, videos, isLive } = req.body;

    const updates = { name, price, description, photos, videos, isLive };

    // Update the service
    const updatedService = await Service.findByIdAndUpdate(req.params.id, updates, { new: true }).exec();

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete a Service
const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id).exec();
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Get all Services for a specific Artist
const getServicesByArtist = async (req, res) => {
  try {
    const artistId = req.params.artistId;

    // Check if the artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Get all services for the artist
    const services = await Service.find({ artistId }).exec();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Toggle Service Live Status
const toggleServiceLiveStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.isLive = !service.isLive;
    const updatedService = await service.save();

    res.status(200).json({ message: `Service is now ${service.isLive ? 'live' : 'offline'}`, updatedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByArtist,
  toggleServiceLiveStatus,
};
