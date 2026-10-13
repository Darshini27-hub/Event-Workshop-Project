const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Category = require("../models/Category");
const { authenticateToken, adminOnly } = require("../middleware/auth");

const router = express.Router();

// View all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find()
            .populate("category", "name")
            .populate("createdBy", "name")
            .sort({ eventDate: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Unable to load events" });
    }
});

// Add event (admin only)
router.post("/", authenticateToken, adminOnly, async (req, res) => {
    try {
        const {
            title, description, category, eventDate,
            location, capacity
        } = req.body;

        if (!title || !category || !eventDate ||
            !location || capacity === undefined) {
            return res.status(400).json({
                message: "Please provide all required event fields"
            });
        }

        if (!mongoose.isValidObjectId(category)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(400).json({
                message: "Category not found"
            });
        }

        const seatCount = Number(capacity);

        if (!Number.isInteger(seatCount) || seatCount < 1) {
            return res.status(400).json({
                message: "Capacity must be a positive whole number"
            });
        }

        const event = await Event.create({
            title,
            description,
            category,
            eventDate,
            location,
            capacity: seatCount,
            availableSeats: seatCount,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });
    } catch (error) {
        res.status(500).json({ message: "Unable to create event" });
    }
});

// Update event (admin only)
router.put("/:id", authenticateToken, adminOnly, async (req, res) => {
    try {
        const updates = {};
        const allowedFields = [
            "title", "description", "category",
            "eventDate", "location"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (req.body.category !== undefined) {
            if (!mongoose.isValidObjectId(req.body.category)) {
                return res.status(400).json({
                    message: "Invalid category ID"
                });
            }

            const categoryExists = await Category.findById(
                req.body.category
            );

            if (!categoryExists) {
                return res.status(400).json({
                    message: "Category not found"
                });
            }
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.json({
            message: "Event updated successfully",
            event
        });
    } catch (error) {
        res.status(500).json({ message: "Unable to update event" });
    }
});

// Delete event (admin only)
router.delete("/:id", authenticateToken, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        await require("../models/Registration").deleteMany({
            event: event._id
        });

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Unable to delete event" });
    }
});

module.exports = router;
