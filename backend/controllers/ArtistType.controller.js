const ArtistType = require('../models/ArtistType.model'); // Replace with the actual path to your ArtistType model

// 1. Create a new ArtistType
const createArtistType = async (req, res) => {
  try {
    const { type } = req.body;

    // Check if type already exists
    const existingType = await ArtistType.findOne({ type });
    if (existingType) {
      return res.status(400).json({ message: 'Artist type already exists' });
    }

    const artistType = new ArtistType({ type });
    const savedArtistType = await artistType.save();
    res.status(201).json(savedArtistType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all ArtistTypes
const getAllArtistTypes = async (req, res) => {
  try {
    const artistTypes = await ArtistType.find();
    res.status(200).json(artistTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get a single ArtistType by ID
const getArtistTypeById = async (req, res) => {
  try {
    const artistType = await ArtistType.findById(req.params.id);
    if (!artistType) {
      return res.status(404).json({ message: 'Artist type not found' });
    }
    res.status(200).json(artistType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update an ArtistType
const updateArtistType = async (req, res) => {
  try {
    const { type } = req.body;

    // Prevent updating to an existing type
    const existingType = await ArtistType.findOne({ type });
    if (existingType && existingType._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Artist type already exists' });
    }

    const updatedArtistType = await ArtistType.findByIdAndUpdate(
      req.params.id,
      { type },
      { new: true }
    );
    if (!updatedArtistType) {
      return res.status(404).json({ message: 'Artist type not found' });
    }
    res.status(200).json(updatedArtistType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete an ArtistType
const deleteArtistType = async (req, res) => {
  try {
    const deletedArtistType = await ArtistType.findByIdAndDelete(req.params.id);
    if (!deletedArtistType) {
      return res.status(404).json({ message: 'Artist type not found' });
    }
    res.status(200).json({ message: 'Artist type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createArtistType,
  getAllArtistTypes,
  getArtistTypeById,
  updateArtistType,
  deleteArtistType,
};
