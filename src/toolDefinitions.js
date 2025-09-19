
export const tools = [
    {
        type: "function",
        name: "findRelevantContent",
        description: "Retrieve relevant content to answer queries.",
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