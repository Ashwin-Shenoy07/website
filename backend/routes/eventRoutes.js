// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// GET ALL EVENTS (ADMIN)
router.get("/", adminAuth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
