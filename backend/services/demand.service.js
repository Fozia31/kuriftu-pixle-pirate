export const predictDemand = (data) => {
    const { isWeekend, isHoliday, weather } = data;
    let demandScore = 50; // neutral starting point

    // Weekend effect
    if (isWeekend) {
        demandScore += 25;
    }

    // Holiday effect
    if (isHoliday) {
        demandScore += 30;
    }

    // Weather effect
    if (weather === "sunny") {
        demandScore += 10;
    } else if (weather === "rainy") {
        demandScore -= 20;
    }

    // Clamp value between 0 and 100
    demandScore = Math.max(0, Math.min(100, demandScore));

    // Determine demand level
    let demandLevel;
    if (demandScore >= 70) {
        demandLevel = "High";
    } else if (demandScore >= 40) {
        demandLevel = "Medium";
    } else {
        demandLevel = "Low";
    }

    return {
        demandLevel,
        score: demandScore,
        confidence: "±10%", // Example confidence value
    };
}
