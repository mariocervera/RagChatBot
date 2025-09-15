import { readFileSync } from 'fs';
import { openai } from '@ai-sdk/openai';
import 'dotenv/config';

const inputFile = './context.txt';
const embeddingModel = openai.embedding('text-embedding-3-small');

async function main() {
    const content = readFileSync(inputFile, 'utf8');
    const embeddings = await generateEmbeddingsFromText(content);
    printEmbeddings(embeddings);
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

function printEmbeddings(embeddings) {
    console.log(`Generated ${embeddings.length} embeddings:`);
    embeddings.forEach((item, index) => {
        console.log(`Chunk ${index + 1}:`);
        console.log(`Content: "${item.content}"`);
        console.log(`Embedding dimensions: ${item.embedding.length}`);
        console.log(`First 5 values: [${item.embedding.slice(0, 5).join(', ')}...]`);
        console.log('-------------');
    });
}



main().catch(console.error);
