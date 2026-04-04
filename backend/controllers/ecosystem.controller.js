import { calculateTotalEcosystem } from '../services/ecosystem.service.js';
import { detectEthiopianHoliday } from '../services/ethiopianHolidays.js';
import { getLiveWeather } from '../services/weather.service.js';
import { getLiveStabilityIndex } from '../services/stability.service.js';
import Announcement from '../models/Announcement.js';
import { PDFParse } from 'pdf-parse';
import Knowledge from '../models/Knowledge.js';
import Document from '../models/Document.js';
import * as ragService from '../services/rag.service.js';

export const setAnnouncementHandler = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // Deactivate old announcements
        await Announcement.updateMany({ active: true }, { active: false });

        // Create new active announcement
        const announcement = await Announcement.create({ message });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ error: 'Failed to set announcement' });
    }
};

export const getAnnouncementsHandler = async (req, res) => {
    try {
        const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
};

export const deleteAnnouncementHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await Announcement.findByIdAndDelete(id);
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
};

const getCityForBranch = (branch) => {
    if (!branch) return 'Bishoftu';
    const lower = branch.toLowerCase();
    if (lower.includes('bahir dar')) return 'Bahir Dar';
    if (lower.includes('entoto')) return 'Entoto';
    // All other Kuriftu Bishoftu properties
    return 'Bishoftu';
};

export const ecosystemLiveHandler = async (req, res) => {
    try {
        const branch = req.query.branch || 'Kuriftu Resort & Spa Bishoftu (Debre Zeit)';
        const city = getCityForBranch(branch);

        // Hardcoded Curated Live Defaults for Kuriftu
        const payload = {
            date: new Date().toISOString().split('T')[0],
            baseRoomPrice: 150,
            baseSpaPrice: 60,
            baseWaterparkPrice: 25,
            isLive: true,
            branch: branch
        };

        const parsedDate = new Date(payload.date);
        const dayOfWeek = parsedDate.getDay();
        payload.isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

        const holidayInfo = detectEthiopianHoliday(payload.date);
        payload.isHoliday = holidayInfo.isHoliday;
        payload.holidayName = holidayInfo.name;
        payload.holidayType = holidayInfo.type;
        payload.holidayIntensity = holidayInfo.intensity;
        payload.ethiopianDate = holidayInfo.ethDate;

        const liveWeather = await getLiveWeather(city).catch(() => ({ tempC: 25, category: 'Clear' }));
        payload.weather = liveWeather.category || 'Clear';
        payload.liveWeatherDetails = liveWeather;

        const stabilityData = await getLiveStabilityIndex().catch(() => ({ index: 75, status: 'Stable' }));
        payload.stabilityScore = stabilityData.index || 75;
        payload.stabilityDetails = stabilityData;

        const report = await calculateTotalEcosystem(payload);
        
        const activeAnnouncement = await Announcement.findOne({ active: true }).sort({ createdAt: -1 });
        if (activeAnnouncement) report.activeAnnouncement = activeAnnouncement.message;

        report.liveWeatherDetails = payload.liveWeatherDetails;
        report.stabilityDetails = payload.stabilityDetails;
        report.branch = branch;

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch live ecosystem state' });
    }
};

export const uploadKnowledgeHandler = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });

        const parser = new PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        const text = result.text.trim();

        if (text.length < 10) {
            return res.status(400).json({ error: 'PDF content too short or not readable' });
        }

        const topic = req.body.topic || 'Resort Manual';

        // 1. Store the Raw Document Intact
        const docRecord = await Document.create({
            name: req.file.originalname,
            data: req.file.buffer, // Original PDF
            mimetype: req.file.mimetype,
            size: req.file.size,
            topic: topic
        });

        // 2. Chunk and Vectorize for the AI
        const chunks = ragService.chunkText(text);
        const embeddings = await ragService.generateEmbeddings(chunks);

        const entries = chunks.map((chunk, i) => ({
            filename: req.file.originalname,
            documentId: docRecord._id,
            content: chunk,
            chunkIndex: i,
            embedding: embeddings[i],
            topic: topic
        }));

        await Knowledge.insertMany(entries);

        res.status(201).json({ 
            message: 'Document stored and vectorized successfully', 
            filename: req.file.originalname,
            docId: docRecord._id,
            chunkCount: chunks.length 
        });
    } catch (error) {
        console.error('Unified Storage Error:', error.message);
        res.status(500).json({ error: 'Failed to process and store document' });
    }
};

// HELPER: To list all uploaded resort documents (Admin Dashboard)
export const getDocumentsHandler = async (req, res) => {
    try {
        // Fetch only metadata (EXCLUDE THE BINARY 'data' field for performance)
        const docs = await Document.find({}, '-data').sort({ uploadDate: -1 });

        // Add chunk metadata for visibility in the dashboard
        const enrichedDocs = await Promise.all(docs.map(async (doc) => {
            const count = await Knowledge.countDocuments({ documentId: doc._id });
            return {
                ...doc.toObject(),
                intelligenceChunks: count
            };
        }));

        res.status(200).json(enrichedDocs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

// HELPER: Delete a document and all its AI chunks
export const deleteDocumentHandler = async (req, res) => {
    try {
        const { id } = req.params;
        await Document.findByIdAndDelete(id);
        await Knowledge.deleteMany({ documentId: id });
        res.status(200).json({ message: 'Document and associated vector intelligence cleared' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete document' });
    }
};

export const ecosystemTotalHandler = async (req, res) => {
    try {
        let payload = req.body;
        if (!payload.date) {
            payload.date = new Date().toISOString().split('T')[0];
        }

        const city = getCityForBranch(payload.branch);

        // Auto-detect Regional Context 
        if (payload.date) {
            const parsedDate = new Date(payload.date);
            const dayOfWeek = parsedDate.getDay();
            payload.isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

            const holidayInfo = detectEthiopianHoliday(payload.date);
            payload.isHoliday = holidayInfo.isHoliday;
            payload.holidayName = holidayInfo.name;
            payload.holidayType = holidayInfo.type;
            payload.holidayIntensity = holidayInfo.intensity;
            payload.ethiopianDate = holidayInfo.ethDate;

            // Phase 2: Live Weather Sync (Resilient)
            try {
                const liveWeather = await getLiveWeather(city);
                liveWeather.condition = liveWeather.rawDescription || (liveWeather.category.charAt(0).toUpperCase() + liveWeather.category.slice(1));
                payload.weather = liveWeather.category || 'Clear';
                payload.liveWeatherDetails = liveWeather;
            } catch (e) {
                console.warn("Live Weather sync failed, using defaults.");
                payload.weather = 'Clear';
                payload.liveWeatherDetails = { tempC: 25, category: 'Clear', condition: 'Sunny' };
            }

            // Phase 3: Live Political Stability Index (Resilient)
            try {
                const stabilityData = await getLiveStabilityIndex();
                payload.stabilityScore = stabilityData.index || 75;
                payload.stabilityDetails = stabilityData;
            } catch (e) {
                console.warn("Stability Index sync failed, using defaults.");
                payload.stabilityScore = 75;
                payload.stabilityDetails = { index: 75, status: 'Stable', details: 'Backup index active.' };
            }
        }

        const report = await calculateTotalEcosystem(payload);

        // Fetch Live Announcement (Resilient)
        try {
            const activeAnnouncement = await Announcement.findOne({ active: true }).sort({ createdAt: -1 });
            if (activeAnnouncement) {
                report.activeAnnouncement = activeAnnouncement.message;
            }
        } catch (e) {
            console.warn("Announcement fetch failed.");
        }

        // Final payload attachment
        report.liveWeatherDetails = payload.liveWeatherDetails || { tempC: 25, category: 'Clear' };
        report.stabilityDetails = payload.stabilityDetails || { index: 75, status: 'Stable' };

        res.status(200).json(report);
    } catch (error) {
        console.error("CRITICAL ECOSYSTEM FAILURE:", error.message);
        res.status(500).json({ 
            error: "Personalized experience temporarily limited.", 
            detail: error.message 
        });
    }
};
