const express = require("express");
const User = require("../models/User");
const Registration = require("../models/Registration");
const { authenticateToken, adminOnly } =require("../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Unable to load users"
        });
    }
});

router.delete("/:id", authenticateToken, adminOnly, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({
                message: "You cannot delete your own account here"
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await Registration.deleteMany({ user: user._id });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Unable to delete user"
        });
    }
});

module.exports = router;
