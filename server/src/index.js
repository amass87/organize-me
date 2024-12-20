//src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.get('/', (req, res) => {
  res.json({ message: 'Planner API server is running!' });
});
app.use('/api/auth', authRoutes);

// Protected routes - Apply auth middleware BEFORE the routes
app.use('/api/tasks', auth);  // Add this line
app.use('/api/tasks', taskRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
