const aiEngine = require('../services/aiEngine');

const predictDemandHandler = async (req, res) => {
    try {
        const { date, isWeekend, isHoliday, weather } = req.body;
        
        // Provide defaults if inputs are missing (basic validation)
        const parsedIsWeekend = isWeekend !== undefined ? Boolean(isWeekend) : false;
        const parsedIsHoliday = isHoliday !== undefined ? Boolean(isHoliday) : false;

        // Call AI Engine
        // No longer enforcing a weather default here, allowing the AI Engine to fetch it if undefined
        const prediction = await aiEngine.predictDemand(date, parsedIsWeekend, parsedIsHoliday, weather);
        
        res.status(200).json(prediction);
    } catch (error) {
        console.error("Error in predictDemandHandler:", error.message);
        res.status(500).json({ error: "Internal Server Error during prediction." });
    }
};

const priceRecommendationHandler = (req, res) => {
    try {
        const { basePrice, demandScore } = req.query;

        if (basePrice === undefined || demandScore === undefined) {
            return res.status(400).json({ error: "Missing basePrice or demandScore query parameters" });
        }

        const recommendation = aiEngine.recommendPrice(Number(basePrice), Number(demandScore));
        
        res.status(200).json(recommendation);
    } catch (error) {
        console.error("Error in priceRecommendationHandler:", error.message);
        res.status(500).json({ error: "Internal Server Error during price recommendation." });
    }
};

const promotionRecommendationHandler = (req, res) => {
    try {
        const { demandScore } = req.query;

        if (demandScore === undefined) {
            return res.status(400).json({ error: "Missing demandScore query parameter" });
        }

        const actions = aiEngine.recommendPromotions(Number(demandScore));
        
        res.status(200).json({ actions });
    } catch (error) {
        console.error("Error in promotionRecommendationHandler:", error.message);
        res.status(500).json({ error: "Internal Server Error during promotion recommendation." });
    }
};

const simulateHandler = (req, res) => {
    try {
        const { basePrice, newPrice, currentDemand } = req.body;

        if (basePrice === undefined || newPrice === undefined || currentDemand === undefined) {
            return res.status(400).json({ error: "Missing required body parameters (basePrice, newPrice, currentDemand)" });
        }

        const simulation = aiEngine.simulateWhatIf(Number(basePrice), Number(newPrice), Number(currentDemand));
        
        res.status(200).json(simulation);
    } catch (error) {
        console.error("Error in simulateHandler:", error.message);
        res.status(500).json({ error: "Internal Server Error during simulation." });
    }
};

module.exports = {
    predictDemandHandler,
    priceRecommendationHandler,
    promotionRecommendationHandler,
    simulateHandler
};
