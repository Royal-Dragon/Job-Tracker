const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Get all applications with filters
router.get('/', async (req, res) => {
  try {
    const { status, fromDate } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (fromDate) filter.applicationDate = { $gte: new Date(fromDate) };
    
    const applications = await Application.find(filter);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new application
router.post('/', async (req, res) => {
  const application = new Application({
    company: req.body.company,
    role: req.body.role,
    status: req.body.status,
    applicationDate: req.body.applicationDate,
    link: req.body.link
  });

  try {
    const newApplication = await application.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update status
router.put('/:id', async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedApp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;