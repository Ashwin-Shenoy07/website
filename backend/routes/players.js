// backend/routes/players.js
const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// POST - Register player (THIS IS THE FIXED VERSION)
router.post('/register', async (req, res) => {
  console.log('Received data:', req.body); // ← THIS LINE WILL SHOW YOU THE TRUTH

  try {
    const player = new Player(req.body);
    await player.save();
    console.log('Player saved successfully:', player);
    res.status(201).json({ message: 'Registration successful!', player });
  } catch (err) {
    console.error('Save error:', err);
    res.status(400).json({ message: 'Failed to save player', error: err.message });
  }
});

// GET - All players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;