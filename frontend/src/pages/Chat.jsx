import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(uuidv4());

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

  const renderMessageContent = (content) => {
    const codeBlockMatch = content.match(/```(\w+)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      const language = codeBlockMatch[1] || 'javascript';
      const code = codeBlockMatch[2];

      return (
        <div className="prose prose-invert prose-sm max-w-none text-gray-200">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.85rem',
              backgroundColor: '#1e1e2e',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-gray-800 px-1 py-0.5 rounded text-green-300 text-sm" {...props}>
            {children}
          </code>
        );
      },
      ul: ({ children }) => <ul className="list-disc ml-6">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal ml-6">{children}</ol>,
      h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-2">{children}</h1>,
      h2: ({ children }) => <h2 className="text-xl font-semibold mt-4 mb-2">{children}</h2>,
      h3: ({ children }) => <h3 className="text-lg font-medium mt-3 mb-1">{children}</h3>,
      p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 underline hover:text-emerald-300"
        >
          {children}
        </a>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
</div>

      );
    }

    return <div className="whitespace-pre-wrap text-sm text-gray-200">{content}</div>;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="flex flex-col w-full max-w-4xl mx-auto">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                {renderMessageContent(message.content)}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4 bg-gray-900">
          <form onSubmit={handleSend} className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-emerald-500 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm transition-all duration-150"
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
