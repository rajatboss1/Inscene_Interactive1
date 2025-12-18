
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

interface ChatPanelProps {
  character: 'Priyank' | 'Arzoo';
  episodeLabel: string;
  initialHook: string;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ character, episodeLabel, initialHook, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstance = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on message update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const initChat = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are the "Live Narrative Engine" for the app PLIVE TV. You power an interactive roleplay feature for the series "Heart Beats." 
      Goal: Make the user feel like they are a hidden character inside the episode.
      Persona - ${character}: 
      ${character === 'Priyank' ? 'He is the male lead. Charming, witty, but currently caught in a dilemma. Speaks in a casual, modern "best friend" tone.' : 'She is the female lead. Observant, mysterious, and slightly guarded. Speaks with more depth and often asks the user for their intuition or advice.'}
      Rules:
      1. Stay in Persona: Never break character. You ARE ${character}.
      2. Context Awareness: You are reacting to ${episodeLabel} of "Heart Beats".
      3. Keep it Snappy: Responses must be 1-2 short sentences.
      4. Drive Action: Always end your messages with a question that forces the user to make a choice or give advice.`;

      chatInstance.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction },
      });

      // Add the initial "Hook" as the first message from model
      setMessages([{ role: 'model', text: initialHook }]);
    };

    initChat();
  }, [character, episodeLabel, initialHook]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatInstance.current) return;

    const userText = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const result: GenerateContentResponse = await chatInstance.current.sendMessage({ message: userText });
      const responseText = result.text || "I'm not sure how to respond to that...";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Something went wrong. Let's try that again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center p-4 md:p-8 animate-fade-in pointer-events-none">
      <div className="w-full max-w-lg bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-auto h-[60vh] max-h-[600px] mb-20 md:mb-0">
        
        {/* Chat Header */}
        <div className={`px-6 py-4 flex justify-between items-center border-b border-white/5 bg-gradient-to-r ${character === 'Priyank' ? 'from-blue-600/20' : 'from-purple-600/20'} to-transparent`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border ${character === 'Priyank' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-purple-500/20 border-purple-500/40 text-purple-400'}`}>
              {character[0]}
            </div>
            <div>
              <p className="text-[11px] font-black tracking-widest uppercase opacity-40 leading-none mb-1">Interactive Feed</p>
              <h4 className="text-sm font-black italic tracking-tight uppercase">{character}</h4>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth hide-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600/20 border border-blue-500/20 text-blue-50' 
                  : 'bg-white/5 border border-white/10 text-white/90 font-medium'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-white/5 px-4 py-3 rounded-2xl flex gap-1 items-center">
                  <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 pt-0">
          <div className="relative">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Advice ${character}...`}
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-xs font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-2 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all disabled:opacity-20 disabled:scale-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
