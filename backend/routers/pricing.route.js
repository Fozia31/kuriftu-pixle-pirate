import express from 'express';
import { getRecommendedPrice } from '../controllers/pricing.controller.js';

const router = express.Router();

router.post('/', getRecommendedPrice);

export default router;
