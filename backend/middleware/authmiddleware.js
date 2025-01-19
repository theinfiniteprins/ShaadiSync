require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            success: false,
            message: 'Authorization token is missing or invalid.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token.',
            });
        }
        if(decoded.role === 'user') {
            req.id = decoded.userId;
            req.role = 'user';
        }
        else{
            req.id = decoded.artistId;
            req.role = 'artist';
        }
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};

module.exports = {
    authMiddleware,
};
