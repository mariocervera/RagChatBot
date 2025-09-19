import 'dotenv/config';
import { readFileSync } from 'fs';
import { generateEmbeddingsForChunks } from './embeddings.js';
import { storeInVectorDatabase } from './database.js';
import { respondTo } from './chat.js';


const contextFile = './resources/context.txt';
const query = "What is my profession?"


async function main() {
    try {
        //const text = readFileSync(contextFile, 'utf8');
        //const embeddings = await generateEmbeddingsForChunks(text);
        //await storeInVectorDatabase(text, embeddings);

        const answer = await respondTo(query)
        console.log(answer)

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main().catch(console.error);
