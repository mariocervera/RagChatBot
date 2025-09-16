import { neon } from '@neondatabase/serverless';
import { nanoid } from 'nanoid';

const connection = neon(process.env.DATABASE_URL);

export async function storeInVectorDatabase(resource, embeddings) {
    const resourceId = await insertResource(resource);
    const embeddingIds = await insertEmbeddings(embeddings, resourceId);

    console.log(`Inserted ${embeddingIds.length} embeddings`);
}

async function insertResource(resourceContent) {
    const result = await connection`
        INSERT INTO resources (content) 
        VALUES (${resourceContent}) 
        RETURNING id
    `;
    return result[0].id;
}

async function insertEmbeddings(embeddings, resourceId) {
    const embeddingIds = [];
    
    for (const item of embeddings) {
        const embeddingId = await insertEmbedding(item.embedding, item.content, resourceId);
        embeddingIds.push(embeddingId);
    }
    
    return embeddingIds;
}

async function insertEmbedding(embedding, content, resourceId) {
    const embeddingId = nanoid();
    
    const result = await connection`
        INSERT INTO embeddings (id, resource_id, content, embedding) 
        VALUES (${embeddingId}, ${resourceId.toString()}, ${content}, ${JSON.stringify(embedding)}::vector) 
        RETURNING id
    `;
    return result[0].id;
}