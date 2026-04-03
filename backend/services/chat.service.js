import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let knowledgeBase = null;

async function loadKB() {
    if (knowledgeBase) return knowledgeBase;
    const kbPath = path.join(__dirname, '../data/resort_kb.json');
    const raw = await readFile(kbPath, 'utf-8');
    knowledgeBase = JSON.parse(raw).resort_info;
    return knowledgeBase;
}

function retrieveRelevantChunks(query, kb, topK = 4) {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);

    const scored = kb.map(item => {
        const textLower = item.text.toLowerCase();
        let score = 0;
        keywords.forEach(kw => {
            if (textLower.includes(kw)) score += 2;
            if (item.topic.includes(kw)) score += 3;
        });
        if (['pricing_strategy', 'resort_overview', 'trevpar'].includes(item.topic)) score += 1;
        return { ...item, score };
    });

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => item.text);
}

// Try Gemini with a strict timeout
async function tryGemini(prompt, timeoutMs = 30000) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const result = await model.generateContent(prompt);
        clearTimeout(timer);
        return result.response.text();
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

function buildPrompt(userQuery, dashboardContext, relevantFacts) {
    const ctx = dashboardContext || {};
    return `You are "Kuriftu Assistant" — an AI Revenue Advisor for Kuriftu Resort (Bishoftu, Ethiopia).
Be concise, data-driven, and executive-level. Use bullet points. Max 200 words per response.
Answer ONLY what is asked — don't repeat generic strategy if the user asks something specific.

## Resort Knowledge:
${relevantFacts.join('\n\n')}

## Live Dashboard Data:
- Date: ${ctx.date ?? 'N/A'}
- Weather: ${ctx.weather ?? 'N/A'}
- Peace Index: ${ctx.stabilityIndex ?? 'N/A'}/100
- Ethiopian Holiday: ${ctx.isHoliday ? ctx.holidayName : 'None'}
- Predicted Occupancy: ${ctx.predictedOccupancy ?? 'N/A'}%
- AI Room Price: $${ctx.aiRoomPrice ?? ctx.baseRoomPrice ?? 'N/A'}/night
- AI Spa Price: $${ctx.aiSpaPrice ?? ctx.baseSpaPrice ?? 'N/A'}/session
- Waterpark Base: $${ctx.baseWaterparkPrice ?? 'N/A'}/visitor
- AI Revenue: $${ctx.aiTotal ?? 'N/A'}
- Old Strategy Revenue: $${ctx.beforeTotal ?? 'N/A'}
- Revenue Uplift: $${ctx.uplift ?? 'N/A'}
- Top Action: ${ctx.recommendation ?? 'Run a prediction first'}

Manager Question: ${userQuery}`;
}

// Fallback templates — only used when Gemini is unavailable
function fallbackResponse(userQuery, ctx) {
    const q = userQuery.toLowerCase();
    const occ = ctx.predictedOccupancy ?? 'unknown';
    const weather = ctx.weather ?? 'Clear';
    const isHoliday = ctx.isHoliday;
    const holidayName = ctx.holidayName ?? '';
    const aiTotal = ctx.aiTotal ? `$${Number(ctx.aiTotal).toLocaleString()}` : 'N/A';
    const beforeTotal = ctx.beforeTotal ? `$${Number(ctx.beforeTotal).toLocaleString()}` : 'N/A';
    const uplift = ctx.uplift ? `$${Number(ctx.uplift).toLocaleString()}` : 'N/A';
    const stab = ctx.stabilityIndex ?? 75;
    const roomPrice = ctx.aiRoomPrice ?? ctx.baseRoomPrice ?? 100;
    const spaPrice = ctx.aiSpaPrice ?? ctx.baseSpaPrice ?? 50;
    const recommendation = ctx.recommendation ?? 'Run a prediction first';
    const date = ctx.date ?? 'today';

    // Handle Greetings & Identity first
    if (q.includes('who are you') || q.includes('who are u') || q.includes('who\'re you') || q.includes('identify yourself')) {
        return `I am **Kuriftu Assistant**, your AI revenue advisor for Kuriftu Resort. I analyze live dashboard data, weather, and occupancy trends to help you optimize pricing and resort strategy. How can I assist you today?`;
    }

    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hello ') || q.startsWith('hi ')) {
        return `Hello! I'm here to help you optimize Kuriftu Resort's revenue today. You can ask me about pricing, occupancy trends, or the impact of the current weather. What's on your mind?`;
    }

    if (q.includes('spa') || q.includes('wellness')) {
        return `## 💆 Spa Analysis — ${date}
- **Recommended Price**: $${spaPrice}/session
- **Occupancy**: ${occ}% → ${occ > 70 ? 'HIGH: raise spa prices' : 'MODERATE: consider room+spa bundle'}
- **Weather**: ${weather} → ${weather?.toLowerCase().includes('rain') ? 'Rain boosts indoor spa demand ✅' : 'Clear weather — promote outdoor activities more'}
${isHoliday ? `- 🎉 ${holidayName}: Add 25% holiday premium` : ''}`;
    }

    if (q.includes('waterpark') || q.includes('water park')) {
        const good = !weather?.toLowerCase().includes('rain');
        return `## 🌊 Waterpark Outlook — ${date}
- **Conditions**: ${good ? '✅ Favorable' : '❌ Poor — rain expected'}
- **Action**: ${good ? `Maximize day passes at $${Math.round((ctx.baseWaterparkPrice ?? 25) * (occ > 70 ? 1.3 : 1))}/visitor` : 'Redirect guests to Spa & Cinema — offer rain-check vouchers'}
- **Occupancy**: ${occ}%`;
    }

    if (q.includes('trevpar') || q.includes('revenue') || q.includes('profit') || q.includes('impact')) {
        return `## 📈 Revenue Impact — ${date}
- **AI Strategy**: ${aiTotal}
- **Old Fixed Strategy**: ${beforeTotal}
- **Uplift**: 🟢 ${uplift}
- **Driver**: ${isHoliday ? `${holidayName} holiday demand surge` : `${weather} weather + ${occ}% occupancy`}`;
    }

    if (q.includes('price') || q.includes('pricing') || q.includes('raise') || q.includes('charge')) {
        return `## 💰 Dynamic Pricing — ${date}
- 🛏️ **Rooms**: $${roomPrice}/night
- 💆 **Spa**: $${spaPrice}/session
- 🌊 **Waterpark**: $${ctx.baseWaterparkPrice ?? 25}/visitor
- **Demand Signal**: ${occ}% occupancy → ${occ > 75 ? 'raise prices 20–30%' : 'maintain rates, push bundles'}
${isHoliday ? `- 🎉 **${holidayName}**: Add 25–35% premium NOW` : ''}`;
    }

    if (q.includes('stability') || q.includes('tourist') || q.includes('peace') || q.includes('foreign')) {
        return `## 🌍 Stability Index — ${date}
- **Peace Index**: ${stab}/100 ${stab > 70 ? '🟢 Favorable' : stab > 50 ? '🟡 Moderate' : '🔴 Warning'}
- **Action**: ${stab < 55 ? 'Pivot to domestic marketing — push SMS bundle deals immediately' : stab < 70 ? 'Balance domestic and international targeting' : 'Maintain full international marketing channels'}`;
    }

    // Default — check if it's a general question or requires summary
    const isGeneralBusiness = q.includes('summary') || q.includes('status') || q.includes('report') || q.length > 20;

    if (!isGeneralBusiness) {
        return `I'm Kuriftu Assistant. I'm not sure about that specific topic, but I can give you an executive summary of today's resort performance. Just ask for a "summary"!`;
    }

    // Weekend / general — always specific to current data
    return `## 📊 Executive Summary — ${date}
- **Occupancy**: ${occ}% | **Weather**: ${weather}
${isHoliday ? `- 🎉 **${holidayName}** detected — apply 25–35% price premium now` : '- 📅 No holiday — focus on weekend leisure travelers'}
- **AI Revenue**: ${aiTotal} vs Old: ${beforeTotal} → Uplift: **${uplift}**
- **Top Action**: ${recommendation}
- ${weather?.toLowerCase().includes('rain') ? '🌧️ Push Spa & Cinema — waterpark will underperform' : '☀️ Push Waterpark day passes — clear skies drive outdoor demand'}`;
}

export async function generateAssistantResponse(userQuery, dashboardContext) {
    const kb = await loadKB();
    const relevantFacts = retrieveRelevantChunks(userQuery, kb);
    const prompt = buildPrompt(userQuery, dashboardContext, relevantFacts);

    // Try Gemini first — it gives truly diverse, question-specific answers
    try {
        const geminiResponse = await tryGemini(prompt);
        return geminiResponse;
    } catch (err) {
        console.warn('Gemini unavailable, using smart fallback:', err.message?.slice(0, 80));
        // Fall back to question-specific templates
        return fallbackResponse(userQuery, dashboardContext || {});
    }
}
