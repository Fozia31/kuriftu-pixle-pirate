import express from 'express';
import { ecosystemTotalHandler } from '../controllers/ecosystem.controller.js';

const router = express.Router();

router.post('/total', ecosystemTotalHandler);

export default router;
