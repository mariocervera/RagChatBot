import { readFileSync } from 'fs';
import { openai } from '@ai-sdk/openai';
import 'dotenv/config';
import { 
    insertResource, 
    insertMultipleEmbeddings, 
} from './database.js';

const contextFile = './resources/context.txt';
const embeddingModel = openai.embedding('text-embedding-3-small');

async function main() {
    try {
        const fileContent = readFileSync(contextFile, 'utf8');
        const embeddings = await generateEmbeddingsFromText(fileContent);
        await storeInDatabase(fileContent, embeddings);
        
    } catch (error) {
        console.error('Error in main process:', error.message);
    }
}

async function generateEmbeddingsFromText(text) {
    const chunks = chunk(text);
    return await generateEmbeddingsFromChunks(chunks);
}

function chunk(text) {
    return text
        .split(/\s+/)
        .filter(word => word.length > 0);
}

async function generateEmbeddingsFromChunks(chunks) {
    try {
        const { embeddings } = await embeddingModel.doEmbed({
            values: chunks,
        });
        
        return embeddings.map((embedding, i) => ({
            content: chunks[i],
            embedding: embedding
        }));
    } catch (error) {
        console.error('Error generating embeddings:', error.message);
        return [];
    }
}

async function storeInDatabase(resource, embeddings) {
    try {

        const resourceId = await insertResource(resource);
        const embeddingIds = await insertMultipleEmbeddings(resourceId, embeddings);
        console.log(`Inserted ${embeddingIds.length} embeddings`);

        
    } catch (error) {
        console.error('Error storing in database:', error.message);
        throw error;
    }
}


main().catch(console.error);
