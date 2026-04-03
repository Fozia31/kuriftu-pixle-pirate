import mongoose from 'mongoose';

const recommendPriceRequestSchema = new mongoose.Schema({
    demandLevel: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    basePrice: Number,
})

export default mongoose.model('RecommendPriceRequest', recommendPriceRequestSchema);