import 'dotenv/config';
import { readFileSync } from 'fs';
import { generateEmbeddingsForChunks } from './embeddings.js';
import { storeEmbeddingsInVectorDatabase } from './database.js';
import { respondUsingTool } from './chat.js';

const contextFile = './resources/context.txt';
const query = "What is my profession?"

async function main() {
    try {
        const text = readFileSync(contextFile, 'utf8');
        const embeddings = await generateEmbeddingsForChunks(text);
        await storeEmbeddingsInVectorDatabase(text, embeddings);
        const answer = await respondUsingTool(query)
        console.log(answer)
    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main();
