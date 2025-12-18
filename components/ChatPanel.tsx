
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

interface ChatPanelProps {
  character: 'Priyank' | 'Arzoo';
  episodeLabel: string;
  initialHook: string;
  avatar: string;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ character, episodeLabel, initialHook, avatar, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imgError, setImgError] = useState(false);
  const chatInstance = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const accentColor = character === 'Priyank' ? '#3b82f6' : '#a855f7';
  const accentGradient = character === 'Priyank' 
    ? 'from-blue-600/40 via-blue-500/10 to-transparent' 
    : 'from-purple-600/40 via-purple-500/10 to-transparent';

  useEffect(() => {
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
      const responseText = result.text || "I'm lost in the moment...";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "The signal is weak... can you say that again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center p-4 md:p-8 animate-fade-in pointer-events-none">
      <div 
        className="w-full max-w-lg bg-black/40 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.9)] pointer-events-auto h-[70vh] max-h-[700px] mb-20 md:mb-0 transition-all duration-500 transform translate-y-0"
        style={{ boxShadow: `0 0 50px -10px ${accentColor}20` }}
      >
        
        {/* Chat Header */}
        <div className={`px-8 py-6 flex justify-between items-center border-b border-white/5 bg-gradient-to-r ${accentGradient}`}>
          <div className="flex items-center gap-4">
            <div className={`relative w-14 h-14 rounded-full p-0.5 border-2 shadow-2xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center text-lg font-black ${character === 'Priyank' ? 'bg-blue-600' : 'bg-purple-600'}`} style={{ borderColor: `${accentColor}80` }}>
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white/5">
                {!imgError ? (
                  <img 
                    key={avatar}
                    src={avatar} 
                    alt={character} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-white">{character[0]}</span>
                )}
              </div>
              <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full animate-pulse shadow-[0_0_10px_#22c55e] z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-60 leading-none">Live Story Feed</p>
              </div>
              <h4 className="text-xl font-black italic tracking-tighter uppercase leading-none">{character}</h4>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-all active:scale-90 group"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 opacity-40 group-hover:opacity-100"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth hide-scrollbar bg-gradient-to-b from-transparent via-transparent to-black/20">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`} style={{ animationDelay: '100ms' }}>
              <div className={`max-w-[85%] px-5 py-3.5 rounded-3xl text-[14px] leading-relaxed shadow-lg ${
                m.role === 'user' 
                  ? 'bg-blue-600/30 border border-blue-400/30 text-blue-50 rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-white/90 font-medium rounded-tl-none backdrop-blur-md'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
               <div className="bg-white/5 px-5 py-3.5 rounded-3xl rounded-tl-none border border-white/10 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-8 pt-0">
          <div className="relative group">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Send your intuition to ${character}...`}
              className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-sm font-medium focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/20 pr-16 shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-2 bottom-2 w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-xl active:scale-90 transition-all disabled:opacity-5 disabled:scale-100 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
            </button>
          </div>
          <div className="mt-4 flex justify-center opacity-20">
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">Decisions impact the story rhythm</p>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUpChat 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpChat {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ChatPanel;
