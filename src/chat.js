import { tools } from "./toolDefinitions.js"
import {findRelevantContent} from "./database.js"
import OpenAI from "openai";

const model = "gpt-4.1-mini"
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let modelInput = []
let modelOutput = undefined

export async function respondUsingTool(query) {
    modelInput = addUserText(modelInput, query)
    modelOutput = await callModelToGetDataForToolCall(modelInput)
    const toolResult = await applyFunctionCall(modelOutput)
    modelInput = addAssistantText(modelInput, toolResult)
    modelOutput = await callModelToGetTextualResponse(modelInput)

    return modelOutput.output_text
}

function addUserText(conversation_array, text) {
    return [...conversation_array, { "role": "user", "content": text }]
}

function addAssistantText(conversation_array, text) {
    return [...conversation_array, { "role": "assistant", "content": JSON.stringify(text) }]
}

async function callModelToGetDataForToolCall(input) {
    return await client.responses.create({ model, tools, input, tool_choice: "required" })
}

async function callModelToGetTextualResponse(input) {
    return await client.responses.create({ model, tools, input })
}

async function applyFunctionCall(modelOutput) {
    for (const item of modelOutput.output) {
        if (item.type == "function_call" && item.name == "findRelevantContent") {
            const args = JSON.parse(item.arguments)
            return await findRelevantContent(args)
        }
    };
}
