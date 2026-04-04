import { calculateTotalEcosystem } from '../services/ecosystem.service.js';
import { detectEthiopianHoliday } from '../services/ethiopianHolidays.js';
import { getLiveWeather } from '../services/weather.service.js';
import { getLiveStabilityIndex } from '../services/stability.service.js';
import Announcement from '../models/Announcement.js';

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

export const ecosystemTotalHandler = async (req, res) => {
    try {
        let payload = req.body;
        if (!payload.date) {
            payload.date = new Date().toISOString().split('T')[0];
        }

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
                const liveWeather = await getLiveWeather('Bishoftu');
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

        const report = calculateTotalEcosystem(payload);

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
