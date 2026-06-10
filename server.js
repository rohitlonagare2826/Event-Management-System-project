const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect('mongodb://127.0.0.1:27017/collegeEventDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Routes
const registerRoutes = require('./routes/register');
const eventRoutes = require('./routes/event');

app.use('/api', registerRoutes);
app.use('/api', eventRoutes);  

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
