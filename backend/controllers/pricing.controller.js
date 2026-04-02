import { recommendPrice } from '../services/pricing.service.js';

export const getRecommendedPrice = async (req, res) => {
    try {
        const response = await recommendPrice(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
