import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ... (Bagian Icons biarkan sama seperti sebelumnya) ...
const Icons = {
    Bot: () => (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        </div>
    ),
    User: () => (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
    ),
    Send: () => (
        <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    ),
    Close: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
};

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Halo! 👋 Aku LaporBot.\nBingung susun kalimat laporan atau coding? Tanya aku aja!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);

        try {
            const response = await axios.post('/ai-chat', { message: userText });
            const reply = response.data.reply;
            setMessages(prev => [...prev, { role: 'ai', text: reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: 'Maaf, koneksi terputus. Coba lagi nanti. 😵‍💫' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {/* Chat Box */}
            {isOpen && (
                <div className="flex flex-col w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 mb-4 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Lapor.in AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-indigo-100 opacity-90">Groq Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg">
                            <Icons.Close />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className="flex-shrink-0 mt-1">
                                    {msg.role === 'ai' ? <Icons.Bot /> : <Icons.User />}
                                </div>
                                
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm overflow-hidden ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                }`}>
                                    
                                    {/* FIX: Bungkus ReactMarkdown dengan div dan pindahkan className ke div ini */}
                                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({node, ...props}) => <p className="mb-1 last:mb-0 leading-relaxed" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                                                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                                strong: ({node, ...props}) => <span className="font-bold" {...props} />,
                                                code: ({node, inline, className, children, ...props}) => {
                                                    return inline ? (
                                                        <code className="bg-black/10 px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                                                    ) : (
                                                        <div className="bg-gray-800 text-gray-100 p-2 rounded-lg my-2 text-xs font-mono overflow-x-auto">
                                                            <code {...props}>{children}</code>
                                                        </div>
                                                    )
                                                }
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>

                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 mt-1"><Icons.Bot /></div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex gap-1.5 items-center">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pertanyaan..."
                            className="flex-1 bg-gray-100 border-0 text-gray-700 text-sm rounded-full px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all hover:scale-105 active:scale-95"
                        >
                            <Icons.Send />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110 transition-all duration-300"
                >
                    <span className="text-2xl animate-bounce-slight group-hover:hidden">🤖</span>
                    <svg className="w-6 h-6 hidden group-hover:block animate-spin-once" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}
        </div>
    );
}