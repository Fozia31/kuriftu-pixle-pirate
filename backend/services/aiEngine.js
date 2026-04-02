const weatherService = require('./weatherService');

const predictDemand = async (date, isWeekend, isHoliday, weather) => {
    let score = 30; // base score

    if (isWeekend) score += 30;
    if (isHoliday) score += 25;
    
    let weatherUsed = weather;
    let dataSource = "provided";

    // Auto-fetch if not provided
    if (!weatherUsed) {
        const weatherData = await weatherService.getWeather("Bishoftu"); // default city 
        weatherUsed = weatherData.weather;
        dataSource = weatherData.source;
    }

    if (weatherUsed) {
        const lowerWeather = weatherUsed.toLowerCase();
        if (lowerWeather === 'sunny') score += 15;
        if (lowerWeather === 'rainy') score -= 10;
        // cloudy: no change
    }

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(score, 100));

    // Determine demand level
    let demandLevel = 'Low';
    if (score > 70) {
        demandLevel = 'High';
    } else if (score > 40) {
        demandLevel = 'Medium';
    }

    // Generate random confidence between 80 and 95
    const confidence = Math.floor(Math.random() * (95 - 80 + 1)) + 80;

    return { demandLevel, score, confidence, dataSource, weatherUsed };
};

const recommendPrice = (basePrice, demandScore) => {
    let currentPrice = Number(basePrice);
    let recommendedPrice = currentPrice;

    if (demandScore > 70) {
        // High demand: increase price by 30%
        recommendedPrice = currentPrice * 1.30;
    } else if (demandScore > 40) {
        // Medium demand: increase by 10%
        recommendedPrice = currentPrice * 1.10;
    } else {
        // Low demand: decrease by 30%
        recommendedPrice = currentPrice * 0.70;
    }

    // Format to 2 decimal places if needed, but returning numeric value 
    // is usually safer.
    return {
        currentPrice: currentPrice,
        recommendedPrice: Number(recommendedPrice.toFixed(2))
    };
};

const recommendPromotions = (demandScore) => {
    let actions = [];

    if (demandScore > 70) {
        actions = [
            "Premium pricing strategy",
            "VIP upsell packages"
        ];
    } else if (demandScore > 40) {
        actions = [
            "Weekend package",
            "Family deals"
        ];
    } else {
        actions = [
            "Offer 20% discount",
            "Bundle spa + room",
            "Free breakfast"
        ];
    }

    return actions;
};

const simulateWhatIf = (basePrice, newPrice, currentDemand) => {
    // If price increases -> demand decreases proportionally
    // expectedDemand = currentDemand - (priceIncrease * 0.5)
    
    const priceIncrease = Number(newPrice) - Number(basePrice);
    let expectedDemand = Number(currentDemand) - (priceIncrease * 0.5);
    expectedDemand = Math.max(0, Math.min(expectedDemand, 100)); // Clamp between 0-100 just in case

    let revenueImpact = "decrease";
    // Basic logic for revenue impact: currentRevenue vs expectedRevenue
    const currentRevenue = Number(basePrice) * Number(currentDemand);
    const expectedRevenue = Number(newPrice) * expectedDemand;

    if (expectedRevenue > currentRevenue) {
        revenueImpact = "increase";
    }

    return {
        expectedDemand: Number(expectedDemand.toFixed(2)),
        revenueImpact
    };
};

module.exports = {
    predictDemand,
    recommendPrice,
    recommendPromotions,
    simulateWhatIf
};
