import { useState } from 'react';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const initialMessages: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your AI learning assistant for PlaceIQ. I can help you with:\n\n• Explaining coding concepts\n• Recommending learning paths\n• Answering questions about courses\n• Providing study tips\n• Clarifying doubts\n\nWhat would you like to know?",
        timestamp: new Date(),
    },
];

import { aiService } from '../../services/aiService';

export function AIChatbotPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Prepare history for context
            const history: { role: "user" | "model"; parts: { text: string }[] }[] = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            const responseText = await aiService.sendMessage(input, history);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('AI Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to my brain right now. Please check your API key or try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl h-[calc(100vh-4rem)] bg-white rounded-2xl border border-gray-200 shadow-xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">AI Learning Assistant</h1>
                            <p className="text-white/80 text-sm font-[family-name:var(--font-sans)]">Your 24/7 study companion</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                'flex gap-3',
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            {message.role === 'assistant' && (
                                <div className="bg-primary/10 p-2 rounded-lg h-fit">
                                    <Bot className="w-5 h-5 text-primary" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    'max-w-[70%] rounded-2xl px-4 py-3',
                                    message.role === 'user'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-900'
                                )}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                <p
                                    className={cn(
                                        'text-xs mt-1',
                                        message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                                    )}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {message.role === 'user' && (
                                <div className="bg-primary/10 p-2 rounded-lg h-fit">
                                    <UserIcon className="w-5 h-5 text-primary" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 justify-start">
                            <div className="bg-primary/10 p-2 rounded-lg h-fit">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about AI, DS, coding, or placements..."
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Press Enter to send • Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
}
