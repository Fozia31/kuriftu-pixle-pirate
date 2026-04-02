import { analyze } from '../services/analysis.service.js';

export const analyzeHandler = async (req, res) => {
    try {
        const result = await analyze(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to analyze data" });
    }
};
