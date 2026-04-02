import mongoose from 'mongoose';

const recommendPriceRequestSchema = new mongoose.Schema({
    demandLevel: "Low" | "Medium" | "High",
    basePrice:Number,
})

export default mongoose.model('RecommendPriceRequest', recommendPriceRequestSchema);