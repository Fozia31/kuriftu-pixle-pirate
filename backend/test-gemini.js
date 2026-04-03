
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
    const key = process.env.GEMINI_KEY;
    console.log('Using Key:', key ? 'FOUND' : 'MISSING');
    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        const result = await model.generateContent('Who are you?');
        console.log('Response:', result.response.text());
    } catch (err) {
        console.error('Gemini Error:', err.message);
    }
}

testGemini();
