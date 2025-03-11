const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Artist = require("../models/Artist.model");
const bcrypt = require('bcrypt');
require("dotenv").config();

const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    role: zod.enum(["user", "artist"]),
});

const signin = async (req, res) => {
    try {
        const parsed = signinBody.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid inputs. Check email, password, or role.",
            });
        }

        const { email, password, role } = req.body;
        if (role === "user") {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found",
                    });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Incorrect password",
                    });
                }
                if(user.isBlocked){
                    return res.status(401).json({
                        success: false,
                        message: "User is blocked",
                    });
                }

                
                const token = jwt.sign({ userId: user._id,role: 'user' }, process.env.JWT_SECRET);
                return res.status(200).json({
                    success: true,
                    token,
                    message: "User signed in successfully",
                });
            } catch (error) {
                console.error("Error finding user:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while processing user",
                });
            }
        } else if (role === "artist") {
            try {
                const artist = await Artist.findOne({ email });

                if (!artist) {
                    return res.status(404).json({
                        success: false,
                        message: "Artist not found",
                    });
                }
                const isMatch = await bcrypt.compare(password, artist.password);
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Incorrect password",
                    });
                }   
                if(artist.isBlocked){
                    return res.status(401).json({
                        success: false,
                        message: "Artist is blocked",
                    });
                }       
                      
                const token = jwt.sign({ artistId: artist._id, role: 'artist' }, process.env.JWT_SECRET);
                return res.status(200).json({
                    success: true,
                    token,
                    message: "Artist signed in successfully",
                });
            } catch (error) {
                console.error("Error finding artist:", error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while processing artist",
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified",
            });
        }
    } catch (error) {
        console.error("Error in signin function:", error);
        return res.status(500).json({
            success: false,
            message: "Unexpected server error",
        });
    }
};

module.exports = {
    signin,
};
