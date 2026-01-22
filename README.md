# AI LangChain Project

This project facilitates document interaction using RAG (Retrieval-Augmented Generation) with LangChain, Pinecone, and OpenAI. It consists of a Node.js/Express server and a React client.

## Server Functions

The server handles file uploads, document processing, and chat functionality.

### Core API (`server/index.js`)

-   **`GET /`**
    -   **Description**: Health check endpoint. Returns a confirmation message that the API is running.
-   **`POST /api/upload`**
    -   **Description**: Handles PDF file uploads.
    -   **Process**:
        1.  Receives file via `multer`.
        2.  Parses PDF text using `pdf-parse`.
        3.  Initializes the vector store with the document text (`initializeVectorStore`).
        4.  Uploads the file to AWS S3 (if credentials are provided).
        5.  Cleans up local file.
-   **`POST /api/chat`**
    -   **Description**: Processes user questions against the uploaded document.
    -   **Process**:
        1.  Verifies document readiness (`isReady` flag).
        2.  Calls `chat()` function to generate a response.

### RAG Logic (`server/rag.js`)

-   **`initializeVectorStore(text)`**
    -   **Description**: Prepares the document for retrieval.
    -   **Details**: Splits text into chunks using `splitText`, initializes Pinecone, and stores document embeddings using OpenAI embeddings.
-   **`chat(question)`**
    -   **Description**: Generates an answer for a user's question.
    -   **Details**: Retrieves relevant context from Pinecone, constructs a prompt with context, and queries the LLM.
-   **`splitText(text, chunkSize, overlap)`**
    -   **Description**: Utility function to split long text into smaller chunks for processing.
-   **`initializePinecone()`**
    -   **Description**: Singleton pattern to initialize and return the Pinecone client.

## Client Functions

The client is a React application for uploading documents and chatting with the bot.

### App Component (`client/src/App.jsx`)

-   **`handleFileUpload(file)`**
    -   **Description**: Sends the selected file to the `/api/upload` endpoint. Handles upload state and errors.
-   **`handleChatWithoutFile()`**
    -   **Description**: Allows access to the chat interface without uploading a file.

### Components

#### ChatWindow (`client/src/components/ChatWindow.jsx`)
-   **`handleSendMessage(e)`**
    -   **Description**: Handles form submission. Sends the user's question to `/api/chat`, updates the message list, and handles the loading state.
-   **`scrollToBottom()`**
    -   **Description**: Automatically scrolls the chat view to the latest message.

#### FileUpload (`client/src/components/FileUpload.jsx`)
-   **`handleDrop(e)`**, **`handleDragOver(e)`**, **`handleDragLeave(e)`**
    -   **Description**: Manage drag-and-drop interactions for file uploading.
-   **`handleChange(e)`**
    -   **Description**: Handles file selection via the traditional file input dialog.
