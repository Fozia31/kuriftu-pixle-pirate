import mongoose from 'mongoose';

const priceingRuleSchema = new mongoose.Schema({
    high: { type: Number, default: 1.3 },
    medium: { type: Number, default: 1.0 },
    low: { type: Number, default: 0.7 },
});

export default mongoose.model('PricingRules', priceingRuleSchema);