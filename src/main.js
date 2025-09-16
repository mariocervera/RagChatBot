import { readFileSync } from 'fs';
import 'dotenv/config';
import { generateEmbeddingsFromText } from './embeddings.js';
import { storeInVectorDatabase } from './database.js';

const contextFile = './resources/context.txt';

async function main() {
    try {
        const text = readFileSync(contextFile, 'utf8');
        const embeddings = await generateEmbeddingsFromText(text);
        await storeInVectorDatabase(text, embeddings);
    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main().catch(console.error);
