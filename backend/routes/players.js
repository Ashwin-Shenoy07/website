// backend/routes/players.js
const express = require('express');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Player = require('../models/Player');

// === CONFIGURE CLOUDINARY ===
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === CLOUDINARY STORAGE ===
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ccl2026',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

const upload = multer({ storage });

// POST - Register
router.post('/register', upload.fields([
  { name: 'aadharFile', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const existing = await Player.findOne({ mobile: req.body.mobile });
    if (existing) {
      return res.status(400).json({ message: "Plyer with same mobile number is already registered!" });
    }

    const player = new Player({
      ...req.body,
      aadharFile: req.files?.aadharFile?.[0]?.filename || '',
      profilePhoto: req.files?.profilePhoto?.[0]?.filename || ''
    });

    await player.save();

    // Format reg number: CCL2026-001
    const regNumber = `CCL2026-${String(player.regNumber).padStart(3, '0')}`;

    res.status(201).json({
      success: true,
      message: "Registration Successful!",
      regNumber,
      name: player.name,
      place: player.place
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Mobile number already registered!" });
    }
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;