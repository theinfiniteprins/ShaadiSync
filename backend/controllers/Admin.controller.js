const { model } = require("mongoose");
const User = require("../models/User.model")
const zod = require("zod");

const adminBody = zod.object({
    email: zod.string().email(),
})

const addAdmin = async (req,res) => {
    const { success } = adminBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }


    console.log(email);
    const existingUser = await User.findOne({
        email
    })

    if (!existingUser) {
        return res.status(411).json({
            message: "Email not found"
        })
    }

    const updatedUser = await User.findOneAndUpdate(
        { email }, 
        { isAdmin: true }, 
        { new: true } 
      );
      if (!updatedUser) {
        return res.status(404).json({
            message: `User with email ${email} not found`,
        });
    }

    res.status(200).json({
        success: true,
        message: "User updated to admin successfully",
        updatedUser,
    });
};

const removeAdmin = async (req,res) => {
    const { success } = adminBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const { email } = req.body;

    const existingUser = await User.findOne({
        email
    })

    if (!existingUser) {
        return res.status(411).json({
            message: "Email not found"
        })
    }

    const updatedUser = await User.findOneAndUpdate(
        { email }, 
        { isAdmin: false }, 
        { new: true } 
      );
      if (!updatedUser) {
        return res.status(404).json({
            message: `User with email ${email} not found`,
        });
    }

    res.status(200).json({
        success: true,
        message: "User updated to admin successfully",
        updatedUser,
    });
};

module.exports = {
    addAdmin,
    removeAdmin
}