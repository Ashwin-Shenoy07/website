const express = require("express");
const router = express.Router();
const News = require("../models/News");

// ✅ GET ALL NEWS
router.get("/", async (req, res) => {
  const news = await News.find().sort({ createdAt: -1 });
  res.json(news);
});

// ✅ GET SINGLE NEWS
router.get("/:id", async (req, res) => {
  const news = await News.findById(req.params.id);
  res.json(news);
});

module.exports = router;
