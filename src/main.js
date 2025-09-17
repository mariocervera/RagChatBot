import { readFileSync } from 'fs';
import 'dotenv/config';
import { generateEmbeddingsForChunks } from './embeddings.js';
import { storeInVectorDatabase, findRelevantContent } from './database.js';


const contextFile = './resources/context.txt';
const query = 'What is my profession?'

async function main() {
    try {
        const text = readFileSync(contextFile, 'utf8');
        const embeddings = await generateEmbeddingsForChunks(text);
        await storeInVectorDatabase(text, embeddings);

        const relevantContent = await findRelevantContent(query)

        console.log(relevantContent)
        
        // TODO: Invoke AI agent using findRelevantContent as tool.

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main().catch(console.error);
