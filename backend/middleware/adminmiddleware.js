const User = require('../models/User.model');

const isAdminMiddleware = async (req, res, next) => {
  try {
    const userId = req.id; 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  isAdminMiddleware
}
