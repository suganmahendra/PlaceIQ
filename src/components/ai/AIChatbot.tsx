import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { X, Send, Sparkles } from 'lucide-react';
import { aiService } from '../../services/aiService';

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string; sender: 'ai' | 'user' }[]>([
        { text: "Hi, I’m your PlaceIQ AI assistant.", sender: 'ai' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const location = useLocation();

    // Context-based greetings and actions
    const getContextInfo = () => {
        if (location.pathname.includes('/learning')) {
            return {
                suggestion: "You’re progressing well in Python. Want to move to ML basics?",
                actions: ["Suggest next topic", "Help with learning path"]
            };
        } else if (location.pathname.includes('/dashboard')) {
            return {
                suggestion: "Ready to boost your placement score today?",
                actions: ["Check my level", "Placement roadmap"]
            };
        } else if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
            return {
                suggestion: "Need help with your account? I can assist with recovery.",
                actions: ["Forgot password?", "Registration help"]
            };
        }
        return {
            suggestion: "How can I help you today?",
            actions: ["What is PlaceIQ?", "Student Guide", "Mentor Guide"]
        };
    };

    const context = getContextInfo();

    const [inputValue, setInputValue] = useState("");

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg = { text, sender: 'user' as const };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            // Convert messages for API history
            const history: { role: "user" | "model"; parts: { text: string }[] }[] = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const response = await aiService.sendMessage(text, history);
            setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "I'm having trouble connecting. Please check your API key.", sender: 'ai' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleActionClick = (action: string) => {
        handleSend(action);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {/* Chat Trigger Button - Always Visible */}
            <motion.button
                layout
                onClick={() => setIsOpen(!isOpen)}
                className="relative group cursor-pointer outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Glow Effect */}
                <div className={`absolute -inset-4 bg-violet-500/40 rounded-full blur-xl transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100 animate-pulse'}`} />

                <div className={`
                    relative flex items-center justify-center 
                    w-14 h-14 md:w-16 md:h-16 
                    rounded-full border border-white/10 shadow-2xl backdrop-blur-xl 
                    transition-all duration-500
                    ${isOpen ? 'bg-slate-900 border-slate-700 rotate-90' : 'bg-slate-900 border-indigo-500/30 rotate-0'}
                `}>
                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        // Custom Cute Robot Face Icon
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white relative z-10">
                            <rect x="2" y="3" width="20" height="18" rx="5" className="fill-indigo-500/20 stroke-white/80" strokeWidth="2" />
                            <path d="M7 10C7 10 7.5 10 9 10C10.5 10 11 10 11 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M13 10C13 10 13.5 10 15 10C16.5 10 17 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M8 15C8 15 10 17 12 17C14 17 16 15 16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="2" r="1.5" className="fill-white" />
                        </svg>
                    )}
                </div>

                {/* Notification Badge - Only show when closed */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
                    </span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[380px] h-[500px] bg-white/90 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2rem] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 pb-4 bg-gradient-to-br from-primary/10 via-white/5 to-transparent border-b border-white/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center p-1 border border-primary/30">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary text-lg">PlaceIQ AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Always Active</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.sender === 'ai' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${msg.sender === 'ai'
                                        ? 'bg-white/80 border border-white/60 text-text-primary rounded-tl-none'
                                        : 'bg-primary text-white rounded-tr-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/50 p-4 rounded-2xl rounded-tl-none border border-white/40 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contextual Suggestion */}
                        {!isTyping && messages.length < 4 && (
                            <div className="px-6 py-3">
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
                                    <p className="text-xs text-text-primary font-bold flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-primary" />
                                        {context.suggestion}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {context.actions.map(action => (
                                            <button
                                                key={action}
                                                onClick={() => handleActionClick(action)}
                                                className="text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 bg-white border border-primary/10 rounded-lg hover:border-primary transition-colors text-primary"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-6 pt-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                                    placeholder="Type your message..."
                                    className="w-full bg-white/40 border border-white/60 rounded-2xl px-5 py-4 pr-14 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ring-0 shadow-inner placeholder:text-text-muted/50"
                                />
                                <button
                                    onClick={() => handleSend(inputValue)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-text-primary hover:bg-black text-white rounded-xl transition-all shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-center text-[10px] font-medium text-slate-400 mt-3">
                                Powered by PlaceIQ Neural Engine
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
