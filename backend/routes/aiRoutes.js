const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /predict-demand
router.post('/predict-demand', aiController.predictDemandHandler);

// GET /price-recommendation
router.get('/price-recommendation', aiController.priceRecommendationHandler);

// GET /recommendations
router.get('/recommendations', aiController.promotionRecommendationHandler);

// POST /simulate
router.post('/simulate', aiController.simulateHandler);

module.exports = router;
