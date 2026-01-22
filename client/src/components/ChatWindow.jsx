import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import robotMascot from '../assets/robot-mascot.png';
import bg from '../assets/techbacknew.png';
import './ChatWindow.css';

const ChatWindow = ({ fileName }) => {
    const [messages, setMessages] = useState([
        {
            role: 'system',
            content: `Hello! I'm ready to answer questions about "${fileName}". What would you like to know?`,
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/chat', {
                question: userMessage,
            });

            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: response.data.answer },
            ]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an error answering that.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="chat-window"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Header removed as per request */}

            <div className="messages-list">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-row ${msg.role === 'user' ? 'user' : 'assistant'}`}
                    >
                        <div className="avatar">
                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div className="message-bubble">{msg.content}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message-row assistant">
                        <div className="avatar">
                            <Bot size={20} />
                        </div>
                        <div className="message-bubble loading">
                            <Loader2 className="animate-spin" size={16} />
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="input-area" onSubmit={handleSendMessage}>
                <div className="input-wrapper" style={{ flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Ask a question..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <button type="submit" disabled={!inputValue.trim() || isLoading}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
