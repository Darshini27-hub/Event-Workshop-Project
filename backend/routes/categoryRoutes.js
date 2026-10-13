const express = require("express");
const Category = require("../models/Category");
const Event = require("../models/Event");
const { authenticateToken, adminOnly } =require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Unable to load categories"
        });
    }
});

router.post("/", authenticateToken, adminOnly, async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description
        });

        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        res.status(500).json({
            message: "Unable to create category"
        });
    }
});

router.put("/:id", authenticateToken, adminOnly, async (req, res) => {
    try {
        const updates = {};

        if (req.body.name !== undefined) {
            updates.name = req.body.name.trim();
        }

        if (req.body.description !== undefined) {
            updates.description = req.body.description;
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to update category"
        });
    }
});

router.delete("/:id", authenticateToken, adminOnly, async (req, res) => {
    try {
        const eventExists = await Event.exists({
            category: req.params.id
        });

        if (eventExists) {
            return res.status(409).json({
                message: "Move or delete the category's events first"
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Unable to delete category"
        });
    }
});

module.exports = router;
