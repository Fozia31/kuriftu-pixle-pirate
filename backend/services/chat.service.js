import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let knowledgeBase = null;

async function loadKB() {
    if (knowledgeBase) return knowledgeBase;
    try {
        const kbPath = path.join(__dirname, '../data/resort_kb.json');
        const raw = await readFile(kbPath, 'utf-8');
        knowledgeBase = JSON.parse(raw).resort_info;
        return knowledgeBase;
    } catch (e) {
        console.error("KB Load Error:", e.message);
        return [];
    }
}

function retrieveRelevantChunks(query, kb, topK = 4) {
    if (!kb || !Array.isArray(kb)) return [];
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);

    const scored = kb.map(item => {
        const textLower = (item.text || "").toLowerCase();
        let score = 0;
        keywords.forEach(kw => {
            if (textLower.includes(kw)) score += 2;
            if ((item.topic || "").toLowerCase().includes(kw)) score += 3;
        });
        if (['pricing_strategy', 'resort_overview', 'trevpar'].includes(item.topic)) score += 1;
        return { ...item, score };
    });

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => item.text);
}

async function tryGemini(prompt, timeoutMs = 30000) {
    if (!process.env.GEMINI_KEY) throw new Error("GEMINI_KEY is missing in env");
    
    // Ensure the key is clean
    const cleanKey = process.env.GEMINI_KEY.trim();
    const genAI = new GoogleGenerativeAI(cleanKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error("GEMINI_CRITICAL_FAILURE:", err.message);
        throw err;
    }
}

function buildPrompt(userQuery, dashboardContext, relevantFacts) {
    const ctx = dashboardContext || {};
    return `You are "Kuriftu Assistant" — an elite, bilingual (English & Amharic/አማርኛ) AI Concierge for Kuriftu Resort in Bishoftu, Ethiopia.
Be warm, professional, data-driven, and culturally respectful. 
LANGUAGE RULE: If the user speaks in Amharic, respond fluently in Amharic. Otherwise, respond in English.
Greeting Style: Use warm Ethiopian greetings like "Selam", "Tadiya", or "Endet Neh/Nesh" when appropriate.
Be concise, use bullet points, and keep responses under 200 words.

## Resort Knowledge:
${relevantFacts.length > 0 ? relevantFacts.join('\n\n') : 'Generic Kuriftu luxury resort context'}

## Live Context:
- Date: ${ctx.date ?? 'today'}
- Weather: ${ctx.weather ?? 'Clear'}
- Occupancy: ${ctx.predictedOccupancy ?? 'N/A'}%

User Question: ${userQuery}`;
}

function isAmharic(text) {
    const amharicRange = /[\u1200-\u137F]/;
    return amharicRange.test(text);
}

function fallbackResponse(userQuery, ctx) {
    const q = userQuery.toLowerCase();
    const hasAmharic = isAmharic(userQuery);

    if (q.includes('who are you') || q.includes('who are u') || q.includes('ማነህ') || q.includes('ማነሽ')) {
        return `I am **Kuriftu Assistant**, your AI concierge. I speak both English and Amharic (አማርኛ). How can I assist you? / እንዴት ልረዳዎት እችላለሁ?`;
    }

    if (q.includes('selam') || q.includes('hello') || q.includes('ሰላም') || q.includes('ታዲያ')) {
        if (hasAmharic) {
            return `ሰላም! እኔ የኩሪፍቱ ረዳት ነኝ። ዛሬ ኩሪፍቱ ሪዞርት ውስጥ ስላለው ሁኔታ ወይም ስለ ስፓ (Spa) እና ሌሎች አገልግሎቶች ልነግርዎ እችላለሁ። ምን ማወቅ ይፈልጋሉ?`;
        }
        return `Selam! I'm your Kuriftu Assistant. I can help you with spa bookings, room details, or resort activities in English or Amharic (አማርኛ). How can I help?`;
    }

    if (hasAmharic) {
        return `ለትዕግስትዎ እናመሰግናለን። በአሁኑ ጊዜ የቴክኒክ ችግር ስላለ በዝርዝር መመለስ አልቻልኩም። ነገር ግን ዛሬ ኩሪፍቱ ሪዞርት ለመዝናናት በጣም ጥሩ ቀን ነው። በቅርቡ በዝርዝር እንመለሳለን።`;
    }

    return `Thank you for your patience. I am currently operating in limited mode due to a connection sync. However, today is a beautiful day at Kuriftu Bishoftu! How else can I assist you?`;
}

export async function generateAssistantResponse(userQuery, dashboardContext) {
    try {
        const kb = await loadKB();
        const relevantFacts = retrieveRelevantChunks(userQuery, kb);
        const prompt = buildPrompt(userQuery, dashboardContext, relevantFacts);

        try {
            const geminiResponse = await tryGemini(prompt);
            return geminiResponse;
        } catch (err) {
            return fallbackResponse(userQuery, dashboardContext || {});
        }
    } catch (err) {
        console.error("GLOBAL_CHAT_ERROR:", err.message);
        return isAmharic(userQuery) 
            ? "ይቅርታ፣ ከዳታቤዝ ጋር መገናኘት አልቻልኩም። እባክዎ ትንሽ ቆይተው እንደገና ይሞክሩ።"
            : "I'm having trouble connecting to my resort database. Please try again in a moment.";
    }
}
