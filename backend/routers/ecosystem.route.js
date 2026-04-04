import express from 'express';
import { 
    ecosystemTotalHandler, 
    setAnnouncementHandler, 
    getAnnouncementsHandler, 
    deleteAnnouncementHandler, 
    ecosystemLiveHandler, 
    uploadKnowledgeHandler,
    getDocumentsHandler,
    deleteDocumentHandler 
} from '../controllers/ecosystem.controller.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/total', ecosystemTotalHandler);
router.get('/live', ecosystemLiveHandler);
router.get('/announcements', getAnnouncementsHandler);
router.post('/announcement', setAnnouncementHandler);
router.delete('/announcement/:id', deleteAnnouncementHandler);
router.post('/upload-knowledge', upload.single('pdf'), uploadKnowledgeHandler);

router.get('/documents', getDocumentsHandler);
router.delete('/documents/:id', deleteDocumentHandler);

export default router;
