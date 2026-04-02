import { predictDemand } from './demand.service.js';
import { recommendPrice } from './pricing.service.js';

export const analyze = async (data) => {
    const { date, isWeekend, isHoliday, weather, basePrice, totalRooms } = data;

    // 1. Demand Prediction
    const demandForecast = predictDemand({ isWeekend, isHoliday, weather });

    // 2. Price Optimization
    const pricingRecommendation = await recommendPrice({
        demandLevel: demandForecast.demandLevel,
        basePrice: basePrice,
    });

    // 3. Occupancy & Revenue Estimation
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

    // 4. Actionable Suggestions
    let actions = [];
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
