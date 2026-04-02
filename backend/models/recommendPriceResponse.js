import mongoose from 'mongoose';

const recommendpriceResponseSchema = new mongoose.Schema({
    recommendedPrice: Number,
    priceChangePercentage: Number,
    message: String,
})

export default mongoose.model('RecommendPriceResponse', recommendpriceResponseSchema);