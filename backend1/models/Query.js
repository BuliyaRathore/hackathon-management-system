const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  name: String,
  email: String,
  category: String,
  message: String,
  status: {
    type: String,
    default: "Pending"
  },
  solution: {
    type: String,
    default: null
  },
  submittedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Query", querySchema);
