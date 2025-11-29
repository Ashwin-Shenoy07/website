const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  battingStyle: { type: String, required: true },
  bowlingStyle: { type: String },
  role: { type: String, required: true }, // Batsman, Bowler, All-rounder, Wicket-keeper
  teamName: { type: String },
  experience: { type: String }
}, { 
    timestamps: true,
    collection: 'Player_Registration' 

});

module.exports = mongoose.model('Player', playerSchema);