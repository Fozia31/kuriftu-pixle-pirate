import RecommendPriceRequest from '../models/recommendPriceRequest.js';
import RecommendPriceResponse from '../models/recommendPriceResponse.js';
import PricingRules from '../models/pricingRules.js';

export const recommendPrice = async (request) => {
    const recommendPriceRequest = new RecommendPriceRequest(request);
    const validationError = recommendPriceRequest.validateSync();
    if (validationError) {
        throw new Error(`Invalid request data: ${validationError.message}`);
    }

    const rules = await PricingRules.findOne();
    if (!rules) {
        const defaultRules = new PricingRules();
        await defaultRules.save();
        rules = defaultRules;
    }

    const { demandLevel, basePrice } = recommendPriceRequest;
    let multiplier;
    let message;

    switch (demandLevel) {
        case 'High':
            multiplier = rules.high;
            message = "High demand detected. Increase price to maximize revenue.";
            break;
        case 'Medium':
            multiplier = rules.medium;
            message = "Moderate demand. Keep current pricing.";
            break;
        case 'Low':
            multiplier = rules.low;
            message = "Low demand detected. Reduce price to attract more customers.";
            break;
        default:
            throw new Error('Invalid demand level');
    }

    const recommendedPrice = basePrice * multiplier;
    const priceChangePercentage = ((recommendedPrice - basePrice) / basePrice) * 100;

    const response = new RecommendPriceResponse({
        recommendedPrice: Math.round(recommendedPrice),
        priceChangePercentage: priceChangePercentage,
        message: message,
    });

    return response;
};




