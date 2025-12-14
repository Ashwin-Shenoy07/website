const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ✅ GET UPCOMING EVENTS
router.get("/", async (req, res) => {
  const today = new Date();

  const events = await Event.find({
    date: { $gte: today }
  }).sort({ date: 1 });

  res.json(events);
});

module.exports = router;
