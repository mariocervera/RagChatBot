import { readFileSync } from 'fs';
import 'dotenv/config';
import { generateEmbeddingsForChunks } from './embeddings.js';
import { storeInVectorDatabase } from './database.js';
//import OpenAI from "openai";

const contextFile = './resources/context.txt';
const query = 'What is my profession?'

async function main() {
    try {
        const text = readFileSync(contextFile, 'utf8');
        const embeddings = await generateEmbeddingsForChunks(text);
        await storeInVectorDatabase(text, embeddings);
    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main().catch(console.error);
