import dotenv from 'dotenv';
dotenv.config();
import * as ragService from '../services/rag.service.js';
import mongoose from 'mongoose';
import Knowledge from '../models/Knowledge.js';

async function testIngestion() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Connected to MongoDB ---');

        const testText = "Kuriftu Resort & Spa Bishoftu offers a luxury experience near Lake Hora. Our spa features traditional Ethiopian coffee ceremonies and hot stone massages. The waterpark is open from 9 AM to 6 PM daily.";
        console.log('Testing chunking...');
        const chunks = ragService.chunkText(testText, 100, 20);
        console.log('Chunks:', chunks);

        console.log('Generating embeddings...');
        const embeddings = await ragService.generateEmbeddings(chunks);
        console.log('Embeddings generated:', embeddings.length);

        console.log('Saving to DB...');
        const entries = chunks.map((chunk, i) => ({
            filename: 'test-manual.pdf',
            content: chunk,
            chunkIndex: i,
            embedding: embeddings[i],
            topic: 'Test Topic'
        }));
        await Knowledge.insertMany(entries);
        console.log('Successfully saved chunks to Knowledge base.');

        console.log('Testing Retrieval...');
        const results = await ragService.findRelevantContext('Tell me about the spa and coffee');
        console.log('RAG Results:', results);

        process.exit(0);
    } catch (e) {
        console.error('RAG Test Failed:', e.message);
        process.exit(1);
    }
}

testIngestion();
