import express from 'express';
import { ecosystemTotalHandler, setAnnouncementHandler } from '../controllers/ecosystem.controller.js';

const router = express.Router();

router.post('/total', ecosystemTotalHandler);
router.post('/announcement', setAnnouncementHandler);

export default router;
