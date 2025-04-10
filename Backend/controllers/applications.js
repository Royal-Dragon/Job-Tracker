import Application from '../models/Application.js';

export const getApplications = async (req, res) => {
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
};

// Add other controller functions (create, update, delete)