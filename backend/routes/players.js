// backend/routes/players.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Player = require('../models/Player');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');                 // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

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