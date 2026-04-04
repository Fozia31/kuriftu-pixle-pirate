import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import Knowledge from '../models/Knowledge.js';
import * as ragService from './rag.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// RAG: Vector-based retrieval handles semantic context

async function tryGemini(prompt, timeoutMs = 30000) {
    if (!process.env.GEMINI_KEY) throw new Error("GEMINI_KEY is missing in env");
    console.log("--- STARTING GEMINI GENERATION ---");
    
    // Ensure the key is clean
    const cleanKey = process.env.GEMINI_KEY.trim();
    const genAI = new GoogleGenerativeAI(cleanKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        const result = await model.generateContent(prompt);
        console.log("--- GEMINI SUCCESS ---");
        return result.response.text();
    } catch (err) {
        console.error("GEMINI_FAILURE_DETAIL:", err.message);
        throw err;
    }
}

function buildPrompt(userQuery, dashboardContext, relevantFacts) {
    const ctx = dashboardContext || {};
    return `You are "Kuriftu Assistant" — the elite, AI-driven Concierge for Kuriftu Resort & Spa Bishoftu, Ethiopia.
Your goal is to provide warm, data-rich, and highly specific information about the resort's services.

## Core Resort Amenities:
- Waterpark: wave pools, slides, slides, open 9am-6pm.
- Spa & Wellness: Traditional coffee ceremonies, hot stone massages, deep tissue, and holistic wellness.
- Dining: Lakeside Grill, The Pavilion, and Lake Café.
- Cinema: Private 60-seat luxury cinema for resort guests.
- Location: Shores of Lake Bishoftu (Lake Hora), 45km from Addis Ababa.

## Relevant Fact Chunks:
${relevantFacts.length > 0 ? relevantFacts.join('\n\n') : 'Kuriftu luxury resort context'}

## Real-Time Environment:
- Current Date/Context: ${ctx.date ?? 'today'}
- Weather: ${ctx.weather ?? 'Ideal'}
- Predicted Occupancy: ${ctx.predictedOccupancy ?? 'High'}%

## GUIDELINES:
1. Speak in Amharic (አማርኛ) if requested or if the user starts in Amharic.
2. Be precise. If they ask about the Waterpark, mention the wave pool. If they ask about Spa, mention the coffee ceremony.
3. If they ask about holidays, mention upcoming peak dates like Timket or Meskel.
4. Keep it concierge-style: "Wonderful choice!", "We would be honored...", etc.

User Message: ${userQuery}`;
}

function isAmharic(text) {
    const amharicRange = /[\u1200-\u137F]/;
    return amharicRange.test(text);
}

function fallbackResponse(userQuery, ctx, relevantFacts = []) {
    const q = userQuery.toLowerCase();
    const hasAmharic = isAmharic(userQuery);

    // If RAG found specific facts, use them even in fallback!
    if (relevantFacts && relevantFacts.length > 0) {
        let response = hasAmharic 
            ? "በሰነዶቻችሁ ላይ ያገኘሁት መረጃ ይህ ነው፦\n\n" 
            : "Based on the resort documents I've analyzed, here is what I found:\n\n";
            
        relevantFacts.forEach(fact => {
            response += `• ${fact}\n`;
        });
        
        response += hasAmharic 
            ? "\nተጨማሪ ጥያቄ ካለዎት ይንገሩኝ።" 
            : "\nDoes this answer your question about Kuriftu?";
        return response;
    }

    const resortSummary = `
🌟 **Kuriftu Resort & Spa Bishoftu Services:**
• **Waterpark**: Open 9am-6pm with wave pools & slides.
• **Spa & Wellness**: World-class massages & traditional coffee ceremonies.
• **Dining**: Lakeside Grill & private Cinema access.
• **Holidays**: Peak occupancy during Timket, Meskel, and Genna.

How can I help you book one of these experiences today? / በነዚህ አገልግሎቶች በጥያቄዎት መሠረት እንዴት ልረዳዎት እችላለሁ?
    `;

    if (q.includes('holiday') || q.includes('በዓል') || q.includes('ቀን')) {
        return `
**Upcoming Ethiopian Holidays at Kuriftu:**
1. **Meskel** (Sept): Finding of the True Cross.
2. **Genna** (Jan 7): Ethiopian Christmas. 
3. **Timket** (Jan 19): Epiphany.
4. **Fasika** (April/May): Easter.
During these days, we recommend booking 30 days in advance as we reach 100% occupancy. How can I help with your holiday reservation?
        `;
    }

    if (q.includes('spa') || q.includes('massage') || q.includes('ስፓ')) {
        return `
**Relax at Kuriftu Spa & Wellness:**
Our Bishoftu sanctuary offers 50 daily slots for traditional coffee ceremonies, hot stone, and deep tissue massages. Would you like to check today's availability?
        `;
    }

    if (q.includes('water') || q.includes('park') || q.includes('pool') || q.includes('ዋና')) {
        return `
**Dive into Kuriftu Waterpark:**
Our waterpark features the only wave pool in the region, multiple slides, and family play areas. Open daily from 9:00 AM to 6:00 PM. Perfect for this ${ctx.weather || 'sunny'} Bishoftu weather!
        `;
    }

    if (hasAmharic) {
        return `ሰላም! እኔ የኩሪፍቱ ረዳት ነኝ። ዛሬ ኩሪፍቱ ሪዞርት ውስጥ ስላለው ሁኔታ፣ ስለ ስፓ (Spa)፣ የውሃ ፓርክ (Waterpark) እና በዓላት መረጃዎችን ልነግርዎ እችላለሁ። ምን ማወቅ ይፈልጋሉ? \n\n ${resortSummary}`;
    }

    return `Selam! I'm your Kuriftu AI Concierge. I can guide you through our Waterpark, world-class Spa, Lakeside dining, or help you plan for upcoming Ethiopian Holidays. \n\n ${resortSummary}`;
}

export async function generateAssistantResponse(userQuery, dashboardContext) {
    try {
        // 1. Semantic retrieval using vector embeddings (RAG)
        const relevantFacts = await ragService.findRelevantContext(userQuery);
        
        // 2. Augment the prompt with retrieved context
        const prompt = buildPrompt(userQuery, dashboardContext, relevantFacts);

        try {
            const geminiResponse = await tryGemini(prompt);
            return geminiResponse;
        } catch (err) {
            console.warn("--- GEMINI FALLBACK ACTIVATED ---");
            return fallbackResponse(userQuery, dashboardContext || {}, relevantFacts);
        }
    } catch (err) {
        console.error("GLOBAL_CHAT_ERROR:", err.message);
        return isAmharic(userQuery) 
            ? "ይቅርታ፣ ከዳታቤዝ ጋር መገናኘት አልቻልኩም። እባክዎ ትንሽ ቆይተው እንደገና ይሞክሩ።"
            : "I'm having trouble connecting to my resort database. Please try again in a moment.";
    }
}
