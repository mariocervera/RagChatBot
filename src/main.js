import { readFileSync } from 'fs';
import 'dotenv/config';
import { generateEmbeddingsForChunks } from './embeddings.js';
import { storeInVectorDatabase, findRelevantContent } from './database.js';
import OpenAI from "openai";


const contextFile = './resources/context.txt';
const query = "What is my profession?"


async function main() {
    try {
        //const text = readFileSync(contextFile, 'utf8');
        //const embeddings = await generateEmbeddingsForChunks(text);
        //await storeInVectorDatabase(text, embeddings);

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        const tools = [
            {
                type: "function",
                name: "findRelevantContent",
                description: "Retrieve relevant content to answer queries related to professions.",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The query to search for relevant content."
                        }
                    },
                    required: ["query"]
                }
            }
        ]
        
        let input = [
            {"role": "user", "content": query}
        ]

        let response = await client.responses.create({
            model: "gpt-4.1-mini",
            tools: tools,
            input,
            tool_choice: "required"
        })

        for (const item of response.output) {
            if (item.type == "function_call" && item.name == "findRelevantContent") {
                const args = JSON.parse(item.arguments)
                const relevantContent = await findRelevantContent(args)
                input.push({
                    role: "assistant",
                    content: JSON.stringify(relevantContent)
                });
            }
          };
          
          const finalResponse = await client.responses.create({
            model: "gpt-4.1-mini",
            tools: tools,
            input: input
          });
          
          console.log(`Final output: ${finalResponse.output_text}`);

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main().catch(console.error);
