import express from 'express';
import { simulateHandler } from '../controllers/simulation.controller.js';

const router = express.Router();

router.post('/simulate', simulateHandler);

export default router;
