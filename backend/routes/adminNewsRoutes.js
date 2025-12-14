const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const News = require("../models/News");

// ✅ CREATE NEWS (ADMIN)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, summary, content, image } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ message: "All fields required" });
    }

    const news = await News.create({
      title,
      summary,
      content,
      image
    });

    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE NEWS (ADMIN)
router.delete("/:id", adminAuth, async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.json({ message: "News deleted" });
});

module.exports = router;
