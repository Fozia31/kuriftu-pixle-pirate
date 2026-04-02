// A simple simulation service to demonstrate "what-if" scenarios.

export const simulate = (data) => {
    const { price, totalRooms } = data;

    const basePrice = 100;
    let predictedDemand = 50; // Start with a neutral demand score.

   
    const priceChangePercentage = ((price - basePrice) / basePrice) * 100;
    predictedDemand -= priceChangePercentage;

    // Clamp the demand score to be between 0 and 100.
    predictedDemand = Math.max(0, Math.min(100, predictedDemand));

    let expectedOccupancy;
    if (predictedDemand >= 80) {
        expectedOccupancy = 90; // Very high demand
    } else if (predictedDemand >= 60) {
        expectedOccupancy = 75; // High demand
    } else if (predictedDemand >= 40) {
        expectedOccupancy = 60; // Medium demand
    } else {
        expectedOccupancy = 45; // Low demand
    }

    // 3. Revenue Calculation
    const occupiedRooms = totalRooms * (expectedOccupancy / 100);
    const estimatedRevenue = price * occupiedRooms;

    return {
        predictedDemand: Math.round(predictedDemand),
        expectedOccupancy,
        estimatedRevenue: Math.round(estimatedRevenue),
    };
};
