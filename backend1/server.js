const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Hackease", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// 🔐 Middleware
const authMiddleware = require("./middleware/authMiddleware");

// 🔃 Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const hackathonRoutes = require("./routes/hackathonRoutes");
app.use("/api/hackathon", hackathonRoutes);

const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);


// 🔄 Query Routes
const queryRoutes = require("./routes/queryRoutes");
app.use("/api/query", queryRoutes);  // ✅ Use correct file

// ✅ Example Create Hackathon Route
const Hackathon = require("./models/Hackathon");

app.post("/api/hackathon/create", authMiddleware, async (req, res) => {
  try {
    const hackathon = new Hackathon({
      ...req.body,
      createdBy: req.user.email,
    });
    await hackathon.save();
    res.status(201).json({ message: "✅ Hackathon created", id: hackathon._id });
  } catch (err) {
    res.status(500).json({ message: "❌ Error creating hackathon", error: err.message });
  }
});

app.get("/api/hackathon/all", async (req, res) => {
  try {
    const hackathons = await Hackathon.find({});
    res.status(200).json(hackathons);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch hackathons", error: err.message });
  }
});

app.get("/api/hackathon/:id", async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }
    res.status(200).json(hackathon);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hackathon", error: err.message });
  }
});

// 🚀 Start Server
app.listen(5000, () => console.log("🚀 Server running at http://localhost:5000"));
