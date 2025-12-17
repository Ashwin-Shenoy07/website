const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const Event = require("../models/Event");

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ================= MULTER STORAGE FOR EVENTS =================
const eventStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: process.env.CLOUDINARY_FOLDER + '/events_and_news',
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: `event-${Date.now()}`
  })
});

const upload = multer({
  storage: eventStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ================= CREATE EVENT =================
router.post(
  "/",
  adminAuth,
  upload.single("image"), // 👈 image field name from frontend
  async (req, res) => {
    try {
      const { title, summary, description, date } = req.body;

      if (!title || !summary || !description || !date) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const event = await Event.create({
        title,
        summary,
        description,
        date,
        image: req.file ? req.file.path : null,
        createdBy: req.admin.id
      });

      res.status(201).json({
        success: true,
        event
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ================= UPDATE EVENT =================
router.put(
  "/:id",
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, summary, description, date } = req.body;

      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      event.title = title;
      event.summary = summary;
      event.description = description;
      event.date = date;

      // ✅ Update image only if new file uploaded
      if (req.file) {
        event.image = req.file.path;
      }

      await event.save();

      res.json({
        success: true,
        event
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ================= DELETE EVENT =================
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
