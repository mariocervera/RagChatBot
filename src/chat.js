import { tools } from "./toolDefinitions.js"
import {findRelevantContent} from "./database.js"
import OpenAI from "openai";


export async function respondTo(query) {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    
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
      
      return finalResponse.output_text
}