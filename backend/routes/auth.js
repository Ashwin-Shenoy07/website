// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// POST /api/auth/login
// Body: { mobile: "9876543210", dob: "2005-06-15" }  ← YYYY-MM-DD from frontend
router.post('/login', async (req, res) => {
  try {
    const { mobile, Dob } = req.body;

    // 1. Find player by mobile
    const player = await Player.findOne({ mobile });
    if (!player) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid mobile number or Date of Birth' 
      });
    }

    // 2. Compare DOB (stored as Date or string in DB)
    const inputDate = new Date(Dob);
    const storedDate = new Date(player.dob);

    // Reset time to compare only date
    inputDate.setHours(0, 0, 0, 0);
    storedDate.setHours(0, 0, 0, 0);

    const isMatch = inputDate.getTime() === storedDate.getTime();

    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid mobile number or Date of Birth' 
      });
    }

    // Success — send minimal data
    res.json({
      success: true,
      message: 'Login successful',
      name: player.name,
      regNumber: player.regNumber 
        ? `CCL2026-${String(player.regNumber).padStart(3, '0')}` 
        : null
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router;