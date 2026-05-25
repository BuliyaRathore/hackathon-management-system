const express = require('express');
const router = express.Router();
const Hackathon = require('../models/Hackathon');

router.post('/create', async (req, res) => {
  try {
    const newHackathon = new Hackathon(req.body);
    await newHackathon.save();
    res.status(201).json({ message: 'Hackathon created successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save hackathon' });
  }
});

module.exports = router;
