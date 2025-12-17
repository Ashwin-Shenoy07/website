// routes/adminNewsRoutes.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const News = require("../models/News");

// ---------------- CREATE NEWS ----------------
router.post("/", adminAuth, async (req, res) => {
  try {
    const { title, summary, content, image, date } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const news = await News.create({
      title,
      summary,
      content,
      image,
      date,
      createdBy: req.admin.id
    });

    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- UPDATE NEWS ----------------
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { title, summary, content, image, date } = req.body;

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        title,
        summary,
        content,
        image,
        date
      },
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(updatedNews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE NEWS ----------------
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
