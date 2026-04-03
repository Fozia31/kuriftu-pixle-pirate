import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../api/client';

const QUICK_QUESTIONS = [
    "What should I do this weekend?",
    "Should I raise spa prices today?",
    "How is the waterpark likely to perform?",
    "What's my TrevPAR outlook?",
];

function MarkdownText({ text }) {
    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-1 my-2">$1</ul>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>');
    return <div className="text-sm leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export default function AssistantBubble({ dashboardContext }) {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "Greetings! I'm your **Kuriftu Intelligence Advisor**. Ask me anything about the live dashboard, weekend strategy, or revenue optimization."
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const sendMessage = async (queryText) => {
        const q = queryText || input.trim();
        if (!q || loading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: q }]);
        setLoading(true);

        try {
            const { data } = await apiClient.post('/chat', {
                query: q,
                dashboardContext: dashboardContext || {}
            });
            setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: '❌ I encountered an error. Please ensure you are running a prediction and try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Bubble Button */}
            <button
                onClick={() => setIsOpen(o => !o)}
                className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen
                        ? 'bg-rose-500/80 rotate-12 scale-95'
                        : 'bg-gold-500 dark:bg-gradient-to-br dark:from-indigo-500 dark:to-purple-600 hover:scale-110 hover:shadow-gold-500/40 dark:hover:shadow-indigo-500/40'
                    }`}
                style={{ boxShadow: isOpen ? '' : '0 0 30px rgba(99,102,241,0.5)' }}
                title="Kuriftu AI Assistant"
            >
                {isOpen ? <X size={24} className="text-white" /> : <Bot size={28} className="text-white" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#060913] animate-pulse"></span>
                )}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[580px] flex flex-col bg-white dark:bg-[#10192D]/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-[28px] shadow-2xl overflow-hidden animate-in font-sans"
                    style={{ animation: 'slideUp 0.3s ease-out' }}>

                    {/* Header */}
                    <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-white/5 bg-[#1A1A1A]">
                        <div className="w-10 h-10 rounded-2xl bg-gold-500 flex items-center justify-center shadow-lg shrink-0">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-black text-white text-sm leading-none">Kuriftu Assistant</p>
                            <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-widest mt-0.5">AI Revenue Advisor · Live</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-emerald-400 font-bold">Online</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                        <Bot size={14} className="text-indigo-400" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                        ? 'bg-[#1A1A1A] dark:bg-indigo-600 text-white rounded-tr-sm ml-auto text-sm font-medium'
                                        : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-slate-200 rounded-tl-sm border border-gray-200 dark:border-white/5'
                                    }`}>
                                    {msg.role === 'assistant'
                                        ? <MarkdownText text={msg.text} />
                                        : <p className="text-sm">{msg.text}</p>
                                    }
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                    <Bot size={14} className="text-indigo-400" />
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                                    <Loader2 size={14} className="text-indigo-400 animate-spin" />
                                    <span className="text-xs text-slate-400 font-medium">Analyzing dashboard data...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2">
                            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold mb-2">Quick Actions</p>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className="text-[10px] bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl font-semibold transition-all"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-transparent">
                        <div className="flex gap-3 items-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 focus-within:border-gold-500/40 dark:focus-within:border-indigo-500/40 transition-all shadow-sm">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                placeholder="Ask your AI advisor..."
                                className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 outline-none font-medium"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 rounded-xl flex items-center justify-center transition-all shrink-0"
                            >
                                <Send size={14} className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </>
    );
}
