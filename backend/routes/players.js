// // backend/routes/players.js
// const express = require('express');
// const router = express.Router();
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const Player = require('../models/Player');

// // === CONFIGURE CLOUDINARY ===
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadToCloudinary = (buffer, originalName, customName, folder = process.env.CLOUDINARY_FOLDER) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: folder,
//         public_id: customName,           // ← This sets the filename!
//         resource_type: 'auto',
//         format: originalName.includes('pdf') ? 'pdf' : undefined
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result.secure_url);
//       }
//     );
//     stream.end(buffer);
//   });
// };

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB
// }).fields([
//   { name: 'aadharFile', maxCount: 1 },
//   { name: 'profilePhoto', maxCount: 1 }
// ]);

// // POST - Register
// router.post('/register', (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) return res.status(400).json({ message: "File too large or invalid" });

//     try {
//       const { name, mobile, place } = req.body;

//       // 1. Prevent duplicate mobile
//       const existing = await Player.findOne({ mobile });
//       if (existing) {
//         return res.status(400).json({ message: "Player with same mobile number is already registered!" });
//       }

//       let aadharUrl = '';
//       let photoUrl = '';

//       // 2. ONLY upload files AFTER success is confirmed
//       if (req.files?.aadharFile?.[0]) {
//         const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
//         const aadharName = `${safeName}_Aadhar_${Date.now()}`;
//         aadharUrl = await uploadToCloudinary(
//           req.files.aadharFile[0].buffer,
//           req.files.aadharFile[0].originalname,
//           aadharName
//         );
//       }

//       if (req.files?.profilePhoto?.[0]) {
//         const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
//         const photoName = `${safeName}_Profile_${Date.now()}`;
//         photoUrl = await uploadToCloudinary(
//           req.files.profilePhoto[0].buffer,
//           req.files.profilePhoto[0].originalname,
//           photoName
//         );
//       }

//       // 3. Save player to DB
//       const player = new Player({
//         ...req.body,
//         aadharFile: aadharUrl,
//         profilePhoto: photoUrl
//       });

//       await player.save();

//       const regNumber = `CCL2026-${String(player.regNumber).padStart(3, '0')}`;

//       res.status(201).json({
//         success: true,
//         message: "Registration Successful!",
//         regNumber,
//         name: player.name,
//         place: player.place
//       });

//     } catch (error) {
//       console.error("Registration failed:", error);
//       res.status(500).json({ message: "Registration failed. Please try again." });
//     }
//   });
// });

// // Get all players (for the "View Players" tab)
// router.get('/viewPlayers', async (req, res) => {
//   try {
//     const players = await Player.find()
//       .sort({ regNumber: 1 })  // CCL2026-001, 002, 003...
//       .select('-aadharFile');  // Hide Aadhar URL from public (privacy)

//     // Format regNumber properly if not already
//     const formatted = players.map(p => ({
//       ...p._doc,
//       regNumber: p.regNumber ? `CCL2026-${String(p.regNumber).padStart(3, '0')}` : 'Pending'
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("Error fetching players:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// backend/routes/players.js
const express = require('express');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Player = require('../models/Player');

// === CLOUDINARY CONFIG ===
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
        public_id: customName,
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

// HELPER: Validate Date of Birth
const isValidDate = (dateString) => {
  // Expected format: YYYY-MM-DD
  if (!dateString || typeof dateString !== 'string') return false;

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  const timestamp = date.getTime();

  if (isNaN(timestamp)) return false;

  // Check if the date string matches exactly what Date() parsed
  // This prevents invalid dates like 2025-02-30
  if (date.toISOString().slice(0, 10) !== dateString) return false;

  // Optional: Age limit (e.g. must be at least 13 years old)
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 13) return false; // Adjust minimum age as needed

  return true;
};

// POST - Register Player
router.post('/register', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File too large or invalid format" });
    }

    try {
      const { name, mobile, place, dob } = req.body;

      // VALIDATE REQUIRED FIELDS
      if (!name || !mobile || !place || !dob) {
        return res.status(400).json({ message: "All fields are required including Date of Birth" });
      }

      // VALIDATE DOB FIRST — BEFORE ANY FILE UPLOAD
      if (!isValidDate(dob)) {
        return res.status(400).json({
          message: "Invalid Date of Birth",
          details: "Please enter a valid date (YYYY-MM-DD). Example: 2005-06-15"
        });
      }

      // Prevent duplicate mobile
      const existing = await Player.findOne({ mobile });
      if (existing) {
        return res.status(400).json({ message: "Player with same mobile number is already registered!" });
      }

      let aadharUrl = '';
      let photoUrl = '';

      // ONLY UPLOAD FILES IF DOB IS VALID
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

      // Save player only after successful validation & uploads
      const player = new Player({
        ...req.body,
        dateOfBirth: new Date(dateOfBirth), // Save as proper Date object
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
        place: player.place,
        dateOfBirth: player.dateOfBirth.toISOString().split('T')[0]
      });

    } catch (error) {
      console.error("Registration failed:", error);
      res.status(500).json({ message: "Registration failed. Please try again." });
    }
  });
});

// GET - View All Players
router.get('/viewPlayers', async (req, res) => {
  try {
    const players = await Player.find()
      .sort({ regNumber: 1 })
      .select('-aadharFile -__v');

    const formatted = players.map(p => ({
      ...p._doc,
      regNumber: p.regNumber ? `CCL2026-${String(p.regNumber).padStart(3, '0')}` : 'Pending',
      dateOfBirth: p.dateOfBirth ? p.dateOfBirth.toISOString().split('T')[0] : null
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;