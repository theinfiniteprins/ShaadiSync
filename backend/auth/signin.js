const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Artist = require("../models/Artist.model");
require("dotenv").config();


const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    role: zod.enum(["user", "artist"])
})


const signin = async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const { role } = req.body;

    if (role === "user") {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            if (user.password === req.body.password) {
                const token = jwt.sign(
                    {
                        userId: user._id,
                    },
                    process.env.JWT_SECRET
                );

                res.json({
                    token: token,
                });
                return;
            } else {
                res.status(401).json({
                    message: "Incorrect password",
                });
                return;
            }
        }

        res.status(404).json({
            message: "User not found",
        });

    }
    else {
        const artist = await Artist.findOne({ email: req.body.email });

        if (artist) {
            if (artist.password === req.body.password) {
                const token = jwt.sign(
                    {
                        artistId: artist._id,
                    },
                    process.env.JWT_SECRET
                );

                res.json({
                    token: token,
                });
                return;
            } else {
                res.status(401).json({
                    message: "Incorrect password",
                });
                return;
            }
        }

        res.status(404).json({
            message: "Artist not found",
        });

    }
};
module.exports = {
    signin,
};