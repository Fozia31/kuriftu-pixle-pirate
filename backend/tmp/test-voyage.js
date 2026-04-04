import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { VoyageAIClient } = require('voyageai');

try {
    const client = new VoyageAIClient({ apiKey: 'test' });
    console.log('VoyageAIClient initialized successfully via require');
} catch (e) {
    console.error('Error initializing VoyageAIClient:', e.message);
}
