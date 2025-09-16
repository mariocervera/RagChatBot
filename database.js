import { neon } from '@neondatabase/serverless';
import { nanoid } from 'nanoid';

const connection = neon(process.env.DATABASE_URL);

export async function insertResource(resourceContent) {
    try {
        const result = await connection`
            INSERT INTO resources (content) 
            VALUES (${resourceContent}) 
            RETURNING id
        `;
        return result[0].id;
    } catch (error) {
        console.error('Error inserting resource:', error.message);
        throw error;
    }
}

export async function insertEmbedding(resourceId, content, embedding) {
    try {
        const embeddingId = nanoid();
        
        const result = await connection`
            INSERT INTO embeddings (id, resource_id, content, embedding) 
            VALUES (${embeddingId}, ${resourceId.toString()}, ${content}, ${JSON.stringify(embedding)}::vector) 
            RETURNING id
        `;
        return result[0].id;
    } catch (error) {
        console.error('Error inserting embedding:', error.message);
        throw error;
    }
}


export async function insertMultipleEmbeddings(resourceId, embeddings) {
    try {
        const embeddingIds = [];
        
        for (const item of embeddings) {
            const embeddingId = await insertEmbedding(resourceId, item.content, item.embedding);
            embeddingIds.push(embeddingId);
        }
        
        return embeddingIds;
    } catch (error) {
        console.error('Error inserting multiple embeddings:', error.message);
        throw error;
    }
}



/**
 * Get all resources from the database
 * @returns {Promise<Array>} - Array of resources
 */
export async function getAllResources() {
    try {
        const result = await connection`SELECT * FROM resources ORDER BY created_at DESC`;
        return result;
    } catch (error) {
        console.error('Error fetching resources:', error.message);
        throw error;
    }
}

/**
 * Get all embeddings from the database
 * @returns {Promise<Array>} - Array of embeddings
 */
export async function getAllEmbeddings() {
    try {
        const result = await connection`SELECT * FROM embeddings ORDER BY id`;
        return result;
    } catch (error) {
        console.error('Error fetching embeddings:', error.message);
        throw error;
    }
}
