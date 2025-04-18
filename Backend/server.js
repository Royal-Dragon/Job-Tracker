require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const applicationRoutes = require('./routes/applications');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/applications', applicationRoutes);

app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`));