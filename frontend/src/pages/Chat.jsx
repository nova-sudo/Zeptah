import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(uuidv4());

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          question: input,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      const assistantMessage = {
        role: 'system',
        content: data.code,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Helper function to detect code blocks
  const renderMessageContent = (content) => {
    const codeBlockMatch = content.match(/```(\w+)?\n([\s\S]*?)```/);

    if (codeBlockMatch) {
      const language = codeBlockMatch[1] || 'javascript';
      const code = codeBlockMatch[2];

      return (
        <SyntaxHighlighter language={language} style={oneDark} customStyle={{ borderRadius: '0.5rem' }}>
          {code}
        </SyntaxHighlighter>
      );
    }

    return <div className="whitespace-pre-wrap">{content}</div>;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 mx-40 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black'
                }`}
              >
                {renderMessageContent(message.content)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSend} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
