const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const Player = require("../models/Player");

// GET /api/admin/players
router.get("/players", adminAuth, async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

module.exports = router;
