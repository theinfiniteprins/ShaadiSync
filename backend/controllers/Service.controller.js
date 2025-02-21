const Service = require('../models/Service.model');
const Artist = require('../models/Artist.model');
const ArtistType = require('../models/ArtistType.model');
const UserUnlockService = require('../models/UserUnlockService.model');
const mongoose = require('mongoose');

// 1. Create a new Service
const createService = async (req, res) => {
  try {
    const {name, price, description, photos, videos } = req.body;
    
    const artist = await Artist.findById(req.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Create the new service
    const newService = new Service({
      artistId: req.id,
      name,
      price,
      description,
      photos,
      videos,
      isLive: false,
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
    const services = await Service.find({isLive: true})
      .populate('artistId', 'name email address artistType') // Populate artist details
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
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete all UserUnlockService records for this service
      await UserUnlockService.deleteMany({ serviceId: req.params.id }).session(session);

      // Delete the service
      const deletedService = await Service.findByIdAndDelete(req.params.id).session(session);
      
      if (!deletedService) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Service not found' });
      }

      // If everything is successful, commit the transaction
      await session.commitTransaction();
      res.status(200).json({ 
        message: 'Service and related records deleted successfully',
        deletedService 
      });
    } catch (error) {
      // If there's an error, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Get all Services for a specific Artist
const getServicesByArtist = async (req, res) => {
  try {
    const artistId = req.id;

    // Check if the artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Get all services for the artist
    const services = await Service.find({ artistId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch artist services',
      error: error.message 
    });
  }
};

// 7. Toggle Service Live Status
const toggleServiceLiveStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('artistId'); // Populate artist details

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const artist = service.artistId; // Get the artist associated with the service
    if(!artist._id.equals(req.id)){
      return res.status(403).json({message: "You are not authorized to toggle this service"});
    }
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found for this service' });
    }

    if (service.isLive) {
      // If the service is live, the artist can turn it off directly
      service.isLive = false;
    } else {
      // If the service is offline, check the conditions to turn it on
      const tenPercentOfPrice = service.price * 0.1;

      if (!artist.isVerified) {
        return res.status(403).json({
          message: 'Service cannot be made live. Artist is not verified.',
        });
      }

      if (artist.balance < tenPercentOfPrice) {
        return res.status(403).json({
          message: `Service cannot be made live. Artist's balance is less than 10% of the service price.`,
        });
      }

      service.isLive = true;
    }

    const updatedService = await service.save();

    // Update maxCharge for the artist
    await updateMaxCharge(artist._id);

    res.status(200).json({
      message: `Service is now ${service.isLive ? 'live' : 'offline'}`,
      updatedService,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update maxCharge for an artist
const updateMaxCharge = async (artistId, session = null) => {
  try {
    // Find all live services for the artist within the session
    const liveServices = await Service.find({ artistId, isLive: true }).session(session);

    // Calculate the maximum charge from the live services
    let maxCharge = 0;
    if (liveServices.length !== 0) {
      // If there are live services, find the highest price
      maxCharge = Math.max(...liveServices.map((service) => service.price));
    }

    // Update the artist's maxCharge within the session
    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      { maxCharge },
      { new: true, session } // Include session in the update query
    );

    // Return the updated maxCharge and artist
    return { updatedArtist, maxCharge };
  } catch (error) {
    console.error('Error updating maxCharge:', error);
    throw new Error('Failed to update maxCharge');
  }
};


const getAllLiveServices = async (req, res) => {
  try {
    const liveServices = await Service.find({ isLive: true })
      .populate('artistId', 'name email address') // Populate artist details
      .exec();
    res.status(200).json({services: liveServices});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modify the getServicesByCategory function
const getServicesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.category;
  
    
    
    // First find the artist type from ArtistType model
    const artistType = await ArtistType.findById(categoryId);
    if (!artistType) {
      return res.status(404).json({ message: 'Artist type not found' });
    }

    // Find all artists of this artist type
    const artists = await Artist.find({ artistType: categoryId });
    //console.log(artists);
    const artistIds = artists.map(artist => artist._id);
    // console.log(artistIds);

    // Find all live services from these artists and populate artist details
    const services = await Service.find({
      artistId: { $in: artistIds },
      isLive: true
    }).populate({
      path: 'artistId',
      select: 'name email profilePic artistType address',
      match: { artistType: categoryId } // Check to ensure artist type matches
    });

    // console.log(services);
    // Filter out any services where artistId is null (in case artist type changed)
    const validServices = services.filter(service => service.artistId);

    res.status(200).json({
      artistType,
      services: validServices
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLatestServiceByArtist = async (req, res) => {
  try {
    const artistId = req.id; // Assuming req.id is the authenticated artist's ID

    // Find the latest service for the given artist, sorted by createdAt in descending order
    const latestService = await Service.findOne({ artistId })
      .sort({ createdAt: -1 }) // Get the most recent service
      .exec();

    if (!latestService) {
      return res.status(404).json({ message: 'No services found for this artist' });
    }

    res.status(200).json(latestService);
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
  getAllLiveServices,
  getServicesByCategory,
  updateMaxCharge,
  getLatestServiceByArtist,
};