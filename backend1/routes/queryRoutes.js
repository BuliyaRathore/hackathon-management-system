const express = require("express");
const router = express.Router();
const Query = require("../models/Query");

// ✅ PATCH - Respond to a query
router.patch("/:id/respond", async (req, res) => {
  const { response } = req.body;
  try {
    const updated = await Query.findByIdAndUpdate(
      req.params.id,
      {
        solution: response,
        status: "resolved",
        responseDate: new Date()
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error responding to query", error: err.message });
  }
});

// ✅ POST - Submit Query
router.post("/", async (req, res) => {
  try {
    const newQuery = new Query(req.body);
    await newQuery.save();
    res.status(201).json({ message: "Query submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting query", error: error.message });
  }
});

// ✅ GET - View all queries
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find().sort({ submittedOn: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching queries", error: error.message });
  }
});

module.exports = router;
