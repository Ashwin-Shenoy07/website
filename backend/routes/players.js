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

const uploadToCloudinary = (buffer, originalName, customName, folder = process.env.CLOUDINARY_FOLDER) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: customName,           // ← This sets the filename!
        resource_type: 'auto',
        format: originalName.includes('pdf') ? 'pdf' : undefined
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).fields([
  { name: 'aadharFile', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]);

// POST - Register
router.post('/register', (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: "File too large or invalid" });

    try {
      const { name, mobile, place } = req.body;

      // 1. Prevent duplicate mobile
      const existing = await Player.findOne({ mobile });
      if (existing) {
        return res.status(400).json({ message: "Player with same mobile number is already registered!" });
      }

      let aadharUrl = '';
      let photoUrl = '';

      // 2. ONLY upload files AFTER success is confirmed
      if (req.files?.aadharFile?.[0]) {
        const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
        const aadharName = `${safeName}_Aadhar_${Date.now()}`;
        aadharUrl = await uploadToCloudinary(
          req.files.aadharFile[0].buffer,
          req.files.aadharFile[0].originalname,
          aadharName
        );
      }

      if (req.files?.profilePhoto?.[0]) {
        const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
        const photoName = `${safeName}_Profile_${Date.now()}`;
        photoUrl = await uploadToCloudinary(
          req.files.profilePhoto[0].buffer,
          req.files.profilePhoto[0].originalname,
          photoName
        );
      }

      // 3. Save player to DB
      const player = new Player({
        ...req.body,
        aadharFile: aadharUrl,
        profilePhoto: photoUrl
      });

      await player.save();

      const regNumber = `CCL2026-${String(player.regNumber).padStart(3, '0')}`;

      res.status(201).json({
        success: true,
        message: "Registration Successful!",
        regNumber,
        name: player.name,
        place: player.place
      });

    } catch (error) {
      console.error("Registration failed:", error);
      res.status(500).json({ message: "Registration failed. Please try again." });
    }
  });
});

module.exports = router;