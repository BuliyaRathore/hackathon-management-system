const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: String, // "candidate" or "organizer"
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  gender: String,
  college: String,   // for participants
  skills: String,    // for participants
  company: String    // for organizers
});

module.exports = mongoose.model("User", userSchema);
