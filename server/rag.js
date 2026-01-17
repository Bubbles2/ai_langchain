const { PineconeStore } = require("@langchain/pinecone");
const { Pinecone } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

// Global store
let vectorStore = null;
let pineconeClient = null;

// Simple text splitter to avoid import issues
const splitText = (text, chunkSize = 1000, overlap = 200) => {
    const chunks = [];
    let startIndex = 0;
    while (startIndex < text.length) {
        const end = Math.min(startIndex + chunkSize, text.length);
        chunks.push(text.slice(startIndex, end));
        startIndex += (chunkSize - overlap);
    }
    return chunks.map(c => ({ pageContent: c, metadata: {} }));
};

// Initialize Pinecone client
const initializePinecone = async () => {
    if (!pineconeClient) {
        pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }
    return pineconeClient;
};

// Initialize Vector Store with Pinecone
const initializeVectorStore = async (text) => {
    const splitDocs = splitText(text);
    const embeddings = new OpenAIEmbeddings();

    // Initialize Pinecone
    const pinecone = await initializePinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // Store documents in Pinecone
    vectorStore = await PineconeStore.fromDocuments(
        splitDocs,
        embeddings,
        {
            pineconeIndex,
            namespace: "pdf-documents", // Optional: organize by namespace
        }
    );
};

const chat = async (question) => {
    if (!vectorStore) throw new Error("Vector store not initialized");

    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
    });

    const retriever = vectorStore.asRetriever();

    // Manual retrieval
    const contextDocs = await retriever.invoke(question);
    const contextText = contextDocs.map(doc => doc.pageContent).join("\n\n");

    const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user's question in a friendly, helpful tone. Use the provided context to answer. 
    If the answer is not in the context, say you don't know based on the document.

    Context:
    {context}

    Question: {question}
  `);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const response = await chain.invoke({
        question,
        context: contextText,
    });

    return response;
};

module.exports = { initializeVectorStore, chat };
