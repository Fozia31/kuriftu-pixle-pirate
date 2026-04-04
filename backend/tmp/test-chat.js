import dotenv from 'dotenv';
dotenv.config();
import { generateAssistantResponse } from '../services/chat.service.js';

async function test() {
    try {
        console.log('Testing with simple query...');
        const response = await generateAssistantResponse('Hello!', { city: 'Bishoftu' });
        console.log('Response:', response);
        if (response.includes('I can guide you through our Waterpark')) {
            console.log('--- WARNING: Falling back to static response ---');
        } else {
            console.log('--- SUCCESS: AI generated a response ---');
        }
    } catch (e) {
        console.error('Test failed:', e.message);
    }
}

test();
