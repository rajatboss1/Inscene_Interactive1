
import React, { useState, useEffect, useRef } from 'react';
import Logo from './components/Logo.tsx';
import ChatPanel from './components/ChatPanel.tsx';

/**
 * PLIVETV - PREMIUM VERTICAL OTT
 */
const HEART_BEATS_DATA = {
  id: 'heart-beats',
  title: 'Heart Beats',
  tagline: 'Your choices define your rhythm.',
  thumbnail: "https://lh3.googleusercontent.com/d/11oMmLSZFpeZsoGxw2uV_bPEWJB4-fvDx",
  avatars: {
    // Bulletproof Proxy Config:
    // 1. images.weserv.nl (Canonical domain)
    // 2. Fully URL-encoded GitHub paths (Safe parsing)
    // 3. n=-1 (Follows infinite redirects for Release assets)
    // 4. t=final (Force cache refresh for new Priyank image)
    Priyank: "https://images.weserv.nl/?url=https%3A%2F%2Fgithub.com%2Frajatboss1%2Fplivetv%2Freleases%2Fdownload%2FVideo%2FPriyank_DP_Final.jpg&w=400&h=400&fit=cover&output=jpg&n=-1&t=final",
    Arzoo: "https://images.weserv.nl/?url=https%3A%2F%2Fgithub.com%2Frajatboss1%2Fplivetv%2Freleases%2Fdownload%2FVideo%2FArzooDP.jpg&w=400&h=400&fit=cover&output=jpg&n=-1&t=v3"
  },
  episodes: [
    { 
      id: 1, 
      label: "Episode 01",
      url: "https://github.com/rajatboss1/plivetv/releases/download/Video/Heart.Beats.Episode.2.mp4",
      triggers: [
        { char: 'Priyank', label: '⚡ Back Priyank up', hook: "Did you see that? I think she's onto us. What should I say to her?" },
        { char: 'Arzoo', label: '🤫 Ask Arzoo the truth', hook: "I have a feeling something is about to go wrong... do you trust him?" }
      ]
    },
    { 
      id: 2, 
      label: "Episode 02",
      url: "https://github.com/rajatboss1/plivetv/releases/download/Video/Heart.Beats.Episode.1.mp4",
      triggers: [
        { char: 'Priyank', label: '🎬 Decide Priyank\'s move', hook: "The way he looked at her just now... I don't know if I can handle this. What's my next move?" },
        { char: 'Arzoo', label: '💓 Tell Arzoo how you feel', hook: "I've been holding back so much. Do you think he even realizes what he's doing?" }
      ]
    },
    { 
      id: 3, 
      label: "Episode 03",
      url: "https://github.com/rajatboss1/plivetv/releases/download/Video/Heart.Beats.Episode.3.mp4",
      triggers: [
        { char: 'Priyank', label: '⚡ Help Priyank choose', hook: "It's getting intense. Who do you think is hiding the bigger secret here?" },
        { char: 'Arzoo', label: '🤫 Question Arzoo', hook: "The mystery is deepening. Can we really trust anyone in this room?" }
      ]
    },
    { 
      id: 4, 
      label: "Episode 04",
      url: "https://github.com/rajatboss1/plivetv/releases/download/Video/Heart.Beats.Episode.4.mp4",
      triggers: [
        { char: 'Priyank', label: '🎬 End the story', hook: "This is it. The moment of truth. What would you do in my place?" },
        { char: 'Arzoo', label: '💓 Comfort Arzoo', hook: "It's all coming to an end. Was any of it even real?" }
      ]
    }
  ]
};

const ReelItem: React.FC<{ 
  episode: typeof HEART_BEATS_DATA.episodes[0], 
  isActive: boolean,
  isMuted: boolean,
  toggleMute: () => void,
  onEnterStory: (char: 'Priyank' | 'Arzoo', hook: string) => void
}> = ({ episode, isActive, isMuted, toggleMute, onEnterStory }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleImgError = (char: string) => {
    setImgErrors(prev => ({ ...prev, [char]: true }));
  };

  return (
    <div className="w-full h-screen snap-start relative bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={episode.url}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onLoadStart={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-2 border-white/5 border-t-white/80 rounded-full animate-spin" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 flex flex-col gap-6 pointer-events-none z-30">
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-8 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
          <span className="text-sm font-black tracking-[0.3em] text-white/90 uppercase">{episode.label}</span>
        </div>

        <div className="flex flex-wrap gap-3 pointer-events-auto">
          {episode.triggers.map((trigger, idx) => (
            <button 
              key={idx}
              onClick={() => onEnterStory(trigger.char as 'Priyank' | 'Arzoo', trigger.hook)}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-full backdrop-blur-[30px] border active:scale-95 transition-all shadow-2xl animate-slide-up hover:brightness-110`}
              style={{ 
                animationDelay: `${idx * 150}ms`,
                backgroundColor: trigger.char === 'Priyank' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                borderColor: trigger.char === 'Priyank' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(168, 85, 247, 0.4)',
                boxShadow: trigger.char === 'Priyank' ? '0 8px 32px -8px rgba(59, 130, 246, 0.5)' : '0 8px 32px -8px rgba(168, 85, 247, 0.5)'
              }}
            >
              <div className={`w-7 h-7 rounded-full overflow-hidden border border-white/20 flex items-center justify-center text-[10px] font-bold ${trigger.char === 'Priyank' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                {!imgErrors[trigger.char] ? (
                  <img 
                    key={HEART_BEATS_DATA.avatars[trigger.char as 'Priyank' | 'Arzoo']}
                    src={HEART_BEATS_DATA.avatars[trigger.char as 'Priyank' | 'Arzoo']} 
                    alt={trigger.char} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    loading="eager"
                    onError={() => handleImgError(trigger.char)}
                  />
                ) : (
                  <span className="text-white">{trigger.char[0]}</span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white">
                {trigger.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute right-6 bottom-32 flex flex-col gap-4 items-center z-30">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleMute(); }} 
          className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center active:scale-90 transition-all hover:bg-white/20 pointer-events-auto"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/60"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.535 7.465a.75.75 0 0 1 1.06 0L22.12 10l-2.525 2.525a.75.75 0 1 1-1.06-1.06L20 10l-1.465-1.465a.75.75 0 0 1 0-1.06Z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/60"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06 4.25 4.25 0 0 1 0 6.01.75.75 0 0 0 1.06 1.06 5.75 5.75 0 0 0 0-8.13ZM21.03 5.97a.75.75 0 0 0-1.06 1.06 8.5 8.5 0 0 1 0 12.02.75.75 0 1 0 1.06 1.06 10 10 0 0 0 0-14.14Z" /></svg>
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-40">
        <div 
          className="h-full bg-blue-500 transition-all duration-150 ease-linear shadow-[0_0_15px_#3b82f6]" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'feed'>('home');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [chatData, setChatData] = useState<{char: 'Priyank' | 'Arzoo', hook: string} | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'feed') {
      document.body.style.overflow = 'hidden';
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.getAttribute('data-index') || '0');
              setActiveIdx(index);
            }
          });
        },
        { threshold: 0.6 }
      );

      const items = document.querySelectorAll('.reel-container');
      items.forEach((item) => observer.observe(item));
      return () => observer.disconnect();
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [view]);

  return (
    <div className="flex flex-col min-h-screen text-white bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      <header className={`fixed top-0 left-0 right-0 z-[1000] px-6 md:px-10 py-6 md:py-8 flex justify-between items-center transition-all duration-700 ${view === 'feed' ? 'bg-gradient-to-b from-black/80 to-transparent' : ''}`}>
        <div className="flex items-center gap-3 md:gap-4 cursor-pointer group active:scale-95 transition-transform" onClick={() => { setView('home'); setChatData(null); }}>
          <Logo size={36} isPulsing={view === 'home'} />
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none">plive<span className="text-blue-500">tv</span></span>
          </div>
        </div>
        
        {view === 'feed' && (
          <button 
            onClick={() => { setView('home'); setChatData(null); }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center active:scale-90 transition-all hover:bg-white/20 group shadow-2xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </header>

      {view === 'home' && (
        <main className="flex-1 flex flex-col items-center justify-center p-6 pt-28 md:pt-36 animate-slide-up relative min-h-screen">
          <div className="w-full max-w-lg">
             <div 
               className="relative group cursor-pointer aspect-square rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
               onClick={() => setView('feed')}
             >
                <img src={HEART_BEATS_DATA.thumbnail} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Heart Beats" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-blue-500/10 backdrop-blur-[6px]">
                   <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-12 md:h-12 ml-1 text-white"><path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" /></svg>
                   </div>
                   <p className="mt-8 text-[10px] md:text-[11px] font-black tracking-[0.6em] uppercase text-white shadow-2xl">Start Experience</p>
                </div>

                <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 right-8 md:right-12 flex flex-col items-start pointer-events-none group-hover:opacity-0 transition-opacity">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="h-1 w-8 bg-blue-500 rounded-full" />
                     <span className="text-[10px] md:text-[11px] font-black tracking-widest text-white/70 uppercase">Interactive</span>
                   </div>
                   <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-3">{HEART_BEATS_DATA.title}</h2>
                   <p className="text-white/40 text-[10px] md:text-[11px] font-bold tracking-[0.5em] uppercase">{HEART_BEATS_DATA.tagline}</p>
                </div>
             </div>

             <div className="mt-12 md:mt-16 flex flex-col items-center gap-6">
               <div className="flex items-center gap-5 md:gap-8 opacity-40 text-[9px] md:text-[10px] font-black tracking-[0.5em] uppercase">
                 <span>4 Episodes</span>
                 <span className="w-1 h-1 rounded-full bg-white/40" />
                 <span>4K Vertical</span>
                 <span className="w-1 h-1 rounded-full bg-white/40" />
                 <span>HDR Ready</span>
               </div>
             </div>
          </div>
        </main>
      )}

      {view === 'feed' && (
        <div 
          ref={feedRef}
          className="fixed inset-0 h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth hide-scrollbar z-[500]"
        >
          {HEART_BEATS_DATA.episodes.map((ep, index) => (
            <div key={ep.id} className="reel-container h-screen w-full" data-index={index}>
              <ReelItem 
                episode={ep} 
                isActive={activeIdx === index} 
                isMuted={isMuted} 
                toggleMute={() => setIsMuted(!isMuted)} 
                onEnterStory={(char, hook) => setChatData({char, hook})}
              />
            </div>
          ))}
        </div>
      )}

      {chatData && (
        <ChatPanel 
          character={chatData.char} 
          episodeLabel={HEART_BEATS_DATA.episodes[activeIdx].label}
          initialHook={chatData.hook}
          avatar={HEART_BEATS_DATA.avatars[chatData.char]}
          onClose={() => setChatData(null)}
        />
      )}

      {view === 'home' && (
        <footer className="mt-auto px-8 md:px-12 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-10 border-t border-white/5 bg-black/10">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 opacity-20 grayscale mb-3">
              <Logo size={24} isPulsing={false} />
              <span className="text-base font-black italic uppercase tracking-tighter">plivetv</span>
            </div>
            <p className="text-[9px] font-black tracking-[0.4em] text-zinc-800 uppercase">Premium Interactive Series</p>
          </div>
          <div className="flex gap-8 md:gap-12 text-[9px] font-black tracking-[0.3em] text-zinc-700 uppercase">
             <a href="#" className="hover:text-blue-500 transition-colors">Press</a>
             <a href="#" className="hover:text-blue-500 transition-colors">Legal</a>
             <a href="#" className="hover:text-blue-500 transition-colors">Support</a>
          </div>
          <p className="text-[9px] font-black tracking-[0.2em] text-zinc-800 uppercase text-center md:text-right">© 2025 plivetv. All Beats Reserved.</p>
        </footer>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
