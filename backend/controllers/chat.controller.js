import { generateAssistantResponse } from '../services/chat.service.js';

export const chat = async (req, res) => {
    try {
        const { query, dashboardContext } = req.body;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Query is required' });
        }

        const response = await generateAssistantResponse(query, dashboardContext || {});
        res.json({ response });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: error.message });
    }
};
