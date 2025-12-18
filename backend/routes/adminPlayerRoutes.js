const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const Player = require("../models/Player");

/**
 * GET players with:
 * - search
 * - pagination
 */
router.get("/", adminAuth, async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { team: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } }
      ]
    };

    const players = await Player.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Player.countDocuments(query);

    res.json({
      players,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET single player (for popup)
 */
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
