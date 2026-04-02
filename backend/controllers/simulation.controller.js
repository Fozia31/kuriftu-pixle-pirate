import { simulate } from '../services/simulation.service.js';

export const simulateHandler = (req, res) => {
    try {
        const result = simulate(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to run simulation" });
    }
};
