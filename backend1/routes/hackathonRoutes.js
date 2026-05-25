const express = require("express");
const router = express.Router();
const Hackathon = require("../models/Hackathon");
const authMiddleware = require("../middleware/authMiddleware");

// Get all hackathons created by a specific organizer
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ createdBy: req.user.email });
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a hackathon
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Hackathon.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.email },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Hackathon not found or unauthorized" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// Delete a hackathon
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Hackathon.findOneAndDelete({ _id: req.params.id, createdBy: req.user.email });
    if (!deleted) return res.status(404).json({ message: "Hackathon not found or unauthorized" });
    res.json({ message: "Hackathon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});


module.exports = router;
