const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const Event = require("../models/Event");

// ✅ CREATE EVENT
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, date, venue, description } = req.body;

    if (!title || !date || !venue) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const event = await Event.create({
      title,
      date,
      venue,
      description
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
