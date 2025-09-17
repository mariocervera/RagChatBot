import { openai } from '@ai-sdk/openai';
import { Embedding } from './Embedding.js'

const embeddingModel = openai.embedding('text-embedding-3-small');

export async function generateEmbeddingsForChunks(text) {
    const chunks = chunk(text);
    return await embedMultiple(chunks);
}

function chunk(text) {
    return text
        .split(/\s+/)
        .filter(word => word.length > 0);
}

async function embedMultiple(chunks) {
    return Promise.all(
        chunks.map((chunk) => embedSingle(chunk))
    );
}

export async function embedSingle(chunk) {
    const { embeddings } = await embeddingModel.doEmbed({
        values: [chunk],
    });

    return new Embedding({ array: embeddings[0], plainText: chunk })
}
