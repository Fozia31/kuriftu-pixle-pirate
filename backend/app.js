const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON request bodies

// Routes
// Connecting the aiRoutes directly to root to match exact endpoint specifications
app.use('/', aiRoutes);

// Basic health check or root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the AI-Based Revenue Optimization System API." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
