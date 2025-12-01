// backend/models/Player.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const playerSchema = new mongoose.Schema({
  regNumber: { type: Number }, // Auto-incremented
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  place: { type: String, required: true },
  aadharLast4: { type: String, required: true },
  aadharFile: { type: String }, // Stores filename
  profilePhoto: { type: String }, // Stores filename
  category: { type: String, enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'], required: true },
  battingStyle: { type: String, enum: ['Right-Handed', 'Left-Handed'], required: true },
  bowlingStyle: { type: String, enum: ['Right Arm', 'Left Arm', 'None'], required: true },
  jerseySize: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'], required: true },
  nameOnJersey: { type: String, required: true },
  numberOnJersey: { type: String, required: true },
  playedLastSeason: { type: String, enum: ['Yes', 'No'], required: true }
}, { 
  timestamps: true,
  collection: process.env.COLLECTION_NAME
});

// Auto-increment regNumber starting from 1
playerSchema.plugin(AutoIncrement, { inc_field: 'regNumber', start_seq: 1 });

module.exports = mongoose.model('Player', playerSchema);