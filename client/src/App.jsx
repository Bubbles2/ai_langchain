import React, { useState } from 'react';
import axios from 'axios';
import { Upload, MessageSquare, FileText, Sparkles, ZoomIn, ZoomOut, Highlighter, Cloud } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ChatWindow from './components/ChatWindow';
import robo from './assets/robo3.png';
import './App.css';

function App() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [chatWithoutFile, setChatWithoutFile] = useState(false);

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFileUploaded(true);
      setFileName(file.name);
    } catch (error) {
      console.error("Upload error", error);
      setUploadError('Failed to upload file. Please ensure the server is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChatWithoutFile = () => {
    setChatWithoutFile(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <MessageSquare className="logo-icon" size={28} />
          <h1>Document Chat</h1>
        </div>
        {fileName && (
          <div className="file-badge">
            <FileText size={16} />
            <span>{fileName}</span>
          </div>
        )}
      </header>

      {/* Robot Chat Button - Fixed in top right */}
      <button className="chat-without-file-btn" onClick={handleChatWithoutFile}>
        <img src={robo} alt="Chat with AI" className="robo-image" />
        <span className="chat-hint">Chat</span>
      </button>

      <main className="app-main">
        {!fileUploaded && !chatWithoutFile ? (
          <div className="upload-view">
            <div className="hero-text">
              <h2>Chat with your PDF</h2>
              <p>Upload a document and ask questions instantly.</p>
            </div>
            <FileUpload onUpload={handleFileUpload} isUploading={isUploading} />
            {uploadError && <p className="error-message">{uploadError}</p>}
          </div>
        ) : (
          <div className="chat-view">
            <ChatWindow fileName={fileName} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
