const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const compareController = require('../controllers/compareController');

// Research Stock Endpoint
router.get('/analyze', analysisController.analyzeCompany);

// Compare Stocks Endpoint
router.get('/compare', compareController.compareCompanies);

// Cache Administration Endpoints
router.post('/cache/clear', analysisController.clearCache);

module.exports = router;
