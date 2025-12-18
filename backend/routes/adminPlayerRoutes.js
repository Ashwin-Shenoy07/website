const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const Player = require("../models/Player");

/**
 * GET players
 * - search
 * - pagination
 */
router.get("/", adminAuth, async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
            { place: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const players = await Player.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Player.countDocuments(query);

    res.status(200).json({
      players,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Admin players fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET single player (popup / modal)
 */
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).lean();

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error("Single player fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
