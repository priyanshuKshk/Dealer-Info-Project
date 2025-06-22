const express = require('express');
const router  = express.Router();
const Dealer  = require('../models/Dealer');

/* --------------------  POST /api/dealers  -------------------- */
router.post('/', async (req, res) => {
  try {
    const dealer = new Dealer(req.body);
    await dealer.save();
    res.status(201).json(dealer);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add dealer', details: err.message });
  }
});

/* --------------------  GET /api/dealers  -------------------- */
router.get('/', async (req, res) => {
  try {
    const { name, state, city } = req.query;   // ← use city
    const filter = {};

    if (name)  filter.name  = { $regex: name,  $options: 'i' };
    if (state) filter.state = state;
    if (city)  filter.city  = city;

    const dealers = await Dealer.find(filter);
    res.json(dealers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dealers', details: err.message });
  }
});

module.exports = router;
