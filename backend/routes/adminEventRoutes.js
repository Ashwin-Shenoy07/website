// routes/adminEventRoutes.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const Event = require("../models/Event");

//CREATE EVENTS
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, summary, description, date, image } = req.body;

    if (!title || !summary || !description || !date) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const event = await Event.create({
      title,
      summary,
      description,
      date,
      image,
      createdBy: req.admin.id
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE EVENTS (ADMIN)
router.delete("/:id", adminAuth, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event deleted" });
});
module.exports = router;
