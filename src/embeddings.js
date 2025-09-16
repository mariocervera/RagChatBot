import { openai } from '@ai-sdk/openai';
import { Embedding } from './Embedding.js'

const embeddingModel = openai.embedding('text-embedding-3-small');

export async function generateEmbeddingsFromText(text) {
    const chunks = chunk(text);
    return await generateEmbeddingsFromChunks(chunks);
}

function chunk(text) {
    return text
        .split(/\s+/)
        .filter(word => word.length > 0);
}

async function generateEmbeddingsFromChunks(chunks) {
    const { embeddings } = await embeddingModel.doEmbed({
        values: chunks,
    });
    
    return embeddings.map((embedding, i) => 
        new Embedding({ array: embedding, plainText: chunks[i] })
    );
}