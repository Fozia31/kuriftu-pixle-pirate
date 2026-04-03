import { predictDemand } from './demand.service.js';
import { recommendPrice } from './pricing.service.js';
import { detectEthiopianHoliday } from './ethiopianHolidays.js';

export const analyze = async (data) => {
    const { date, weather, basePrice, totalRooms } = data;

    // 1. Auto-Detect Dates
    const parsedDate = new Date(date);
    const dayOfWeek = parsedDate.getDay();
    const autoWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

    const holidayInfo = detectEthiopianHoliday(date);
    const autoHoliday = holidayInfo.isHoliday;

    // 2. Demand Prediction
    const demandForecast = predictDemand({ isWeekend: autoWeekend, isHoliday: autoHoliday, weather });

    // 3. Price Optimization
    const pricingRecommendation = await recommendPrice({
        demandLevel: demandForecast.demandLevel,
        basePrice: basePrice,
    });

    // 4. Occupancy & Revenue Estimation
    let expectedOccupancy;
    if (demandForecast.demandLevel === 'High') {
        expectedOccupancy = 80;
    } else if (demandForecast.demandLevel === 'Medium') {
        expectedOccupancy = 60;
    } else {
        expectedOccupancy = 40;
    }
    const occupiedRooms = totalRooms * (expectedOccupancy / 100);
    const estimatedRevenue = pricingRecommendation.recommendedPrice * occupiedRooms;

    // 5. Actionable Suggestions
    let actions = [];
    if (autoHoliday) {
        actions.push(`Important: Target date coincides with ${holidayInfo.name}! Local tourism will spike heavily.`);
    }
    if (demandForecast.demandLevel === 'High') {
        actions.push("Increase price to maximize revenue.");
        actions.push("Offer premium packages and upsell services.");
    } else if (demandForecast.demandLevel === 'Low') {
        actions.push("Offer midweek discount to attract more guests.");
        actions.push("Bundle spa services or other amenities.");
    } else {
        actions.push("Maintain current pricing and focus on guest experience.");
    }

    return {
        demandForecast,
        pricingRecommendation,
        expectedOccupancy,
        estimatedRevenue: Math.round(estimatedRevenue),
        actions,
    };
};
