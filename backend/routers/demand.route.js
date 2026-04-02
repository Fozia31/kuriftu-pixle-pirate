import express from 'express';
import { predictDemandHandler } from '../controllers/demand.controller.js';

const router = express.Router();

router.post('/', predictDemandHandler);

export default router;
