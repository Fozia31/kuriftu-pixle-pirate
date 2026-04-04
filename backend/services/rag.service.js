import { createRequire } from 'module';
import Knowledge from '../models/Knowledge.js';

const require = createRequire(import.meta.url);
const { VoyageAIClient } = require('voyageai');

/**
 * RAG Service: The Intelligence Engine for Kuriftu Resort.
 * Handles semantic chunking, vector embedding generation, and similarity retrieval.
 */

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

/**
 * Splits a large text into manageable, overlapping segments to maintain context at boundaries.
 */
export const chunkText = (text, maxLength = 800, overlap = 100) => {
    if (!text || text.length <= maxLength) return [text];
    
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        let end = start + maxLength;
        // Try to break at a newline or space if possible
        if (end < text.length) {
            const lastSpace = text.lastIndexOf(' ', end);
            if (lastSpace > start + (maxLength / 2)) {
                end = lastSpace;
            }
        }
        chunks.push(text.slice(start, end).trim());
        start = end - overlap;
        if (start < 0) start = 0;
        if (end >= text.length) break;
    }
    return chunks.filter(c => c.length > 20);
};

/**
 * Generates high-dimensional vector embeddings for a list of strings using Voyage AI.
 */
export const generateEmbeddings = async (texts) => {
    try {
        const response = await client.embed({
            input: texts,
            model: "voyage-3", // Optimized for retrieval
        });
        // The SDK returns an array of objects containing the embedding
        return response.data.map(d => d.embedding);
    } catch (error) {
        console.error("Voyage AI Embedding Error:", error.message);
        throw new Error("Failed to generate vector embeddings.");
    }
};

/**
 * Performs a semantic search across the Knowledge base using MongoDB Atlas Vector Search.
 * This requires a 'vector_index' to be active on the knowledges collection.
 */
export const findRelevantContext = async (query, topK = 4) => {
    try {
        // 1. Generate Query Vector (1024D via Voyage-3)
        const [queryEmbedding] = await generateEmbeddings([query]);

        if (!queryEmbedding) return [];

        // 2. Execute Atlas Vector Search Aggregation
        const results = await Knowledge.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index", // Must match manual Atlas index name
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100, // Higher candidates = higher accuracy
                    limit: topK
                }
            },
            {
                $project: {
                    content: 1,
                    topic: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ]);

        if (results.length === 0) {
            console.warn("RAG: No relevant context found in Vector Index.");
            return [];
        }

        // 3. Return the Top-K results formatted for LLM context
        return results.map(s => `[Topic: ${s.topic}] ${s.content}`);

    } catch (error) {
        console.error("Atlas Vector Search Error:", error.message);
        // Fallback or Silent fail - logging is critical for debugging Atlas Index issues
        return [];
    }
};
