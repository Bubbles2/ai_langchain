require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { initializeVectorStore, chat } = require('./rag');

const app = express();
const port = process.env.PORT || 3000;

// Config
app.use(cors());
app.use(express.json());

// Upload storage (temporary)
const upload = multer({ dest: 'uploads/' });

// Global state mechanism for simplicity (per session/instance)
// In a real app, use a database or session store.
let isReady = false;

app.get('/', (req, res) => {
    res.send('Document Chat API is running');
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const filePath = req.file.path;
        console.log('Processing file:', req.file.originalname);

        const dataBuffer = fs.readFileSync(filePath);

        // Use v2 API
        const parser = new PDFParse({ data: dataBuffer });
        const textResult = await parser.getText();
        const infoResult = await parser.getInfo();
        await parser.destroy();

        const data = {
            text: textResult.text,
            numpages: infoResult.total
        };


        // Initialize RAG
        await initializeVectorStore(data.text);
        isReady = true;

        // Cleanup uploaded file
        fs.unlinkSync(filePath);

        res.json({ message: 'File processed successfully. You can now chat with it.', pageCount: data.numpages });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file');
    }
});

app.post('/api/chat', async (req, res) => {
    if (!isReady) {
        return res.status(400).json({ error: 'Please upload a document first.' });
    }

    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    try {
        const answer = await chat(question);
        res.json({ answer });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Error generating answer' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
