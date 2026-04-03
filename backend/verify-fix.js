
import { generateAssistantResponse } from './services/chat.service.js';
import dotenv from 'dotenv';
dotenv.config();

async function verifyIdentity() {
    const query = "who are u";
    console.log(`Query: ${query}`);
    const response = await generateAssistantResponse(query, {});
    console.log('--- RESPONSE ---');
    console.log(response);
    console.log('----------------');
}

verifyIdentity();
