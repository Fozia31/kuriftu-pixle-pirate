import express from 'express';
import { analyzeHandler } from '../controllers/analysis.controller.js';

const router = express.Router();

router.post('/analyze', analyzeHandler);

export default router;
