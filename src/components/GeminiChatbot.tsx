import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Globe,
  Zap,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
  timestamp: string;
}

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'স্বাগতম KHAN TOP UP এ! আমি আপনার AI গেমিং ও টপ-আপ অ্যাসিস্ট্যান্ট। Free Fire ডায়মন্ড (২৫ থেকে ১২,০০০ 💎), উইকলি/মান্থলি মেম্বারশিপ, মিষ্টি বক্স বা বিকাশ/নগদ পেমেন্ট নিয়ে কোনো প্রশ্ন থাকলে আমাকে জিজ্ঞেস করুন!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history
      const history = messages.slice(-8).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'model',
        text: data.reply || 'Sorry, I could not process that request.',
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'model',
          text: 'জরুরি সহায়তার জন্য আমাদের 24/7 WhatsApp হেল্পলাইনে যোগাযোগ করুন: 01575630127',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'ডায়মন্ডের রেট কত?',
    'বিকাশে টাকা পাঠাবো কীভাবে?',
    'উইকলি ও মান্থলি কম্বো প্যাকেজগুলো কী কী?',
    'Latest Free Fire Redeem Codes',
  ];

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 text-white shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group"
          title="Ask AI Gaming Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black animate-pulse" />
          </div>
          <span className="text-xs font-['Orbitron'] font-bold tracking-wider hidden sm:inline">
            AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[550px] max-h-[85vh] bg-[#0c1120] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/90 flex flex-col overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#11192e] via-[#162345] to-[#11192e] border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-['Orbitron'] font-bold text-xs text-white">
                    KHAN TOP UP AI
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-bold flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" />
                    <span>Search Grounded</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Powered by Gemini 3.8 &bull; Online 24/7
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scrollable Thread */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                          : 'bg-[#141b30] border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {m.text}

                      {/* Google Search Sources list if available */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700/80 space-y-1 text-[10px]">
                          <span className="text-slate-400 font-semibold block">
                            Google Search Sources:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {m.sources.slice(0, 3).map((src, idx) => (
                              <a
                                key={idx}
                                href={src.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-black/40 text-cyan-300 hover:underline flex items-center gap-1 border border-cyan-900/50"
                              >
                                <span>{src.title}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 px-1">{m.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Searching &amp; typing answer...</span>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-1.5 bg-[#090d18] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-[#13192b] hover:bg-[#1a233c] text-cyan-300 border border-cyan-500/30 text-[10px] whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#0e1424] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about diamonds, passes, payments..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#13192b] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
