const User = require('../models/userModel'); // Replace with the actual path to your User model

const isAdminMiddleware = async (req, res, next) => {
  try {
    // Assuming the user ID is stored in the request (e.g., from a JWT or session)
    const userId = req.userId; // Ensure `req.userId` is populated via authentication middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = isAdminMiddleware;
