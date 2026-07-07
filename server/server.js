const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const apiRouter = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Apply Global Middlewares
app.use(cors());
app.use(express.json());

// API Routes Bindings
app.use('/api', apiRouter);

// Basic Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
    service: 'AlphaLens AI Engine'
  });
});

// Serve static client assets
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Fallback Route Handler (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'NotFound', message: `Route ${req.originalUrl} not found` });
});

// Register Global Error Handler
app.use(errorHandler);

// Export app for Vercel Serverless Functions
module.exports = app;

// Listen on Port (only if run directly)
if (require.main === module) {
  const PORT = config.port || 5000;
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` 🚀 AlphaLens AI Engine backend booted successfully!`);
    console.log(` Port: ${PORT}`);
    console.log(` Node Environment: ${config.nodeEnv}`);
    console.log(` Target LLM Model: ${config.geminiModel}`);
    console.log(` Caching TTL: 10 minutes`);
    console.log(`=======================================================`);
  });
}

