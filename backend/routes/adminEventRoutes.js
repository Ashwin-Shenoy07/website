const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const Event = require("../models/Event");

// CREATE EVENT
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, summary, description, image, eventDate, venue } = req.body;

    if (!title || !eventDate || !venue || !summary) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const event = await Event.create({
      title,
      summary,
      description,
      image,
      venue,
      date: eventDate,
      createdBy: req.admin.id
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE EVENT
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        date: req.body.eventDate
      },
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE EVENT
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
