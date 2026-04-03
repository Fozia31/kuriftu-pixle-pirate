import { calculateTotalEcosystem } from '../services/ecosystem.service.js';
import { detectEthiopianHoliday } from '../services/ethiopianHolidays.js';
import { getLiveWeather } from '../services/weather.service.js';
import { getLiveStabilityIndex } from '../services/stability.service.js';

export const ecosystemTotalHandler = async (req, res) => {
    try {
        let payload = req.body;

        // Auto-detect Regional Context 
        if (payload.date) {
            const parsedDate = new Date(payload.date);
            const dayOfWeek = parsedDate.getDay();
            payload.isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

            const holidayInfo = detectEthiopianHoliday(payload.date);
            payload.isHoliday = holidayInfo.isHoliday;

            // Phase 2: Live Weather Sync for Bishoftu
            const liveWeather = await getLiveWeather('Bishoftu');
            payload.weather = liveWeather.category;
            payload.liveWeatherDetails = liveWeather;

            // Phase 3: Live Political Stability Index (News Sentiment)
            const stabilityData = await getLiveStabilityIndex();
            payload.stabilityScore = stabilityData.index;
            payload.stabilityDetails = stabilityData;
        }

        const report = calculateTotalEcosystem(payload);

        // Attach the live data details to the final report so the frontend can display them seamlessly
        if (payload.liveWeatherDetails) {
            report.liveWeatherDetails = payload.liveWeatherDetails;
        }
        if (payload.stabilityDetails) {
            report.stabilityDetails = payload.stabilityDetails;
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: "Failed to process ecosystem logic.", detail: error.message });
    }
};
