# RagChatBot

This project demonstrates Retrieval-Augmented Generation (RAG) using the OpenAI API and a vector database. The goal is to provide a simple example of how to retrieve content relevant to a query and use it to improve the answer of a Large Language Model (LLM).

## Processing of the context file

The file called `context.txt` contains information that is relevant to the user's query.

The content of this file is divided into chunks and embedded using an embedding model. The embeddings are stored in a vector database, which allows us to retrieve content that is relevant to the user's query by embedding the query using the same model and performing a **vector similarity search**.

## Query answering flow

The `chat.js` file implements a coordinator that centralizes the interactions between the LLM and the tool that obtains data from the vector database.

The execution flow is the following:

1. The user's textual query is sent to the LLM as input.

2. The LLM answers text that allows the coordinator to invoke the proper tool; in this case, the `findRelevantContent` function.

3. The coordinator parses the response from the LLM, invokes the `findRelevantContent` function and sends the result back into the LLM.

4. The LLM responds the original query using the information retrieved from the vector database.
