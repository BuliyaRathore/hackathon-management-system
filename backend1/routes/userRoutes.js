const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login request for:", email);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ User not found");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("✅ Password match:", isMatch);

  if (!isMatch) {
    console.log("❌ Incorrect password");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      college: user.college,
      company: user.company,
      phone: user.phone,
      gender: user.gender,
      skills: user.skills,
      role: user.role
    }
  });
});

console.log("JWT Secret:", process.env.JWT_SECRET);
// ✅ Add middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Add profile route
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Update user profile
router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const updated = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

console.log("🔥 PATCH /profile route hit");
console.log("📦 Body:", req.body);
console.log("🔐 User:", req.user);


module.exports = router;
