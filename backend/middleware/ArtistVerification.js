require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Authorization token is missing or invalid.");
        
        return res.status(403).json({
            success: false,
            message: 'Authorization token is missing or invalid.',
        });
    }

    const token = authHeader.split(' ')[1];  
    console.log(token);
      
    if (!token) {
        return res.status(401).json({ success: false, message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.artistData = decoded;
        console.log(decoded);
        
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = {
    verifyToken,
};
