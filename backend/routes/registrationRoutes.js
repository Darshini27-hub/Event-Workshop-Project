const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Register event
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { eventId } = req.body;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const existing = await Registration.findOne({
            user: req.user.id,
            event: eventId
        });

        if (existing && existing.status === "registered") {
            return res.status(409).json({
                message: "You are already registered"
            });
        }

        if (event.availableSeats < 1) {
            return res.status(400).json({
                message: "No seats available"
            });
        }

        if (existing && existing.status === "cancelled") {
            existing.status = "registered";
            await existing.save();
        } else {
            await Registration.create({
                user: req.user.id,
                event: eventId
            });
        }

        event.availableSeats -= 1;
        await event.save();

        res.status(201).json({
            message: "Event registration successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to register for event"
        });
    }
});

// View the user registrations
router.get("/my", authenticateToken, async (req, res) => {
    try {
        const registrations = await Registration.find({
            user: req.user.id
        })
            .populate("event")
            .sort({ createdAt: -1 });

        res.json(registrations);
    } catch (error) {
        res.status(500).json({
            message: "Unable to load registrations"
        });
    }
});

// Cancel registration
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const registration = await Registration.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        if (registration.status === "cancelled") {
            return res.status(400).json({
                message: "Registration already cancelled"
            });
        }

        registration.status = "cancelled";
        await registration.save();

        await Event.findByIdAndUpdate(registration.event, {
            $inc: { availableSeats: 1 }
        });

        res.json({ message: "Registration cancelled" });
    } catch (error) {
        res.status(500).json({
            message: "Unable to cancel registration"
        });
    }
});

module.exports = router;
