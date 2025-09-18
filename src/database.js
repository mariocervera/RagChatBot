import { neon } from '@neondatabase/serverless';
import { embedSingle } from './embeddings.js';
import { nanoid } from 'nanoid';

const connection = neon(process.env.DATABASE_URL);

export async function storeInVectorDatabase(resource, embeddings) {
    const resourceId = await insertResource(resource);
    await insertEmbeddings(embeddings, resourceId);
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
    await Promise.all(
        embeddings.map(embedding => insertEmbedding(embedding, resourceId))
    );
}

async function insertEmbedding(embedding, resourceId) {
    const embeddingId = nanoid();
    
    await connection`
        INSERT INTO embeddings (id, resource_id, content, embedding) 
        VALUES (${embeddingId}, ${resourceId.toString()}, ${embedding.plainText()}, ${JSON.stringify(embedding.array())}::vector) 
        RETURNING id
    `;
}

export async function findRelevantContent(queryJSON) {
    const query = queryJSON["query"]
    const embedding = await embedSingle(query);
    const topK = 3

    const result = await connection`
      SELECT r.content as resource_content,
             e.content as embedding_content,
             1 - (e.embedding <=>${toStringLiteral(embedding.array())}::vector) AS similarity
      FROM embeddings e JOIN resources r ON r.id = e.resource_id::int
      ORDER BY similarity desc
      LIMIT ${topK};
    `;

    return result.map(row => row.resource_content);
  }

  function toStringLiteral(array) {
    return `[${array.join(",")}]`;
  }