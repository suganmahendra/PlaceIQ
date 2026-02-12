import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { X, Send, Sparkles } from 'lucide-react';
import { AIRobot } from './AIRobot';

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

    const handleActionClick = (action: string) => {
        setMessages(prev => [...prev, { text: action, sender: 'user' }]);
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(false);
            let aiResponse = "";
            if (action.includes("level")) aiResponse = "Your current AI readiness level is 'Intermediate'. You need 200 more points to reach 'Advanced'!";
            else if (action.includes("topic")) aiResponse = "Based on your progress, I recommend starting 'Neural Networks Simplified' in the ML module.";
            else aiResponse = "That's a great question! Let me pull up the relevant section for you.";

            setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {/* Chat Icon & Trigger */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 20 }}
                        whileHover={{ scale: 1.1 }}
                        className="relative group cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-accent-violet rounded-full blur-xl opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
                        <div className="relative glass-card p-2 rounded-3xl border-white/50 shadow-2xl overflow-hidden active:scale-95 transition-transform">
                            <AIRobot className="w-16 h-16 md:w-20 md:h-20" mode="active" />
                        </div>

                        {/* Notification Badge */}
                        <div className="absolute top-0 right-0 w-5 h-5 bg-accent-pink border-2 border-white rounded-full animate-bounce" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="w-[350px] md:w-[400px] h-[550px] glass-card rounded-[32px] border-white/40 shadow-[0_32px_64px_-16px_rgba(106,13,173,0.3)] flex flex-col overflow-hidden backdrop-blur-3xl"
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
                                className="p-2 hover:bg-white/50 rounded-xl transition-colors text-text-muted hover:text-text-primary"
                            >
                                <X className="w-5 h-5" />
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
                                    placeholder="Type your message..."
                                    className="w-full bg-white/40 border border-white/60 rounded-2xl px-5 py-4 pr-14 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all ring-0 shadow-inner placeholder:text-text-muted/50"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-text-primary hover:bg-black text-white rounded-xl transition-all shadow-lg">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-center text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mt-4 opacity-50 italic">
                                PlaceIQ AI Core v4.2 // Advanced Real-time Learning
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
