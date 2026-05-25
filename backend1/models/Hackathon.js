const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  name: String,
  description: String,
  guidelines: String,
  start: Date,
  end: Date,
  link: String
});

const HackathonSchema = new mongoose.Schema({
  title: String,
  location: String,
  regStart: Date,
  regEnd: Date,
  prize1: String,
  prize2: String,
  prize3: String,
  maxTeamSize: Number,
  description: String,
  problem: [String],
  rounds: [RoundSchema],
  createdBy: String // From JWT
});

module.exports = mongoose.model('Hackathon', HackathonSchema);
