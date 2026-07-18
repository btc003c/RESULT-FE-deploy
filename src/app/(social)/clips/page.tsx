"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Rich Mock Data for Clips
const MOCK_CLIPS = [
  {
    id: "clip-1",
    author: "Jane Doe",
    handle: "@janedoe",
    category: "Match Highlights",
    title: "Unbelievable last minute goal in the finals! ⚽🔥",
    likes: "124K",
    comments: "4.2K",
    shares: "12K",
    thumbnail: "https://picsum.photos/seed/sports/800/1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "clip-2",
    author: "Tech Insider",
    handle: "@techinsider",
    category: "Tech",
    title: "Is the new Quantum Phone actually worth it? Hands-on review. 📱✨",
    likes: "89K",
    comments: "1.2K",
    shares: "5K",
    thumbnail: "https://picsum.photos/seed/tech/800/1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "clip-3",
    author: "E-Sports Daily",
    handle: "@esports",
    category: "Gaming",
    title: "Insane 1v5 clutch in the CS:GO Majors! Must watch. 🎮",
    likes: "310K",
    comments: "15K",
    shares: "45K",
    thumbnail: "https://picsum.photos/seed/gaming/800/1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: "clip-4",
    author: "Chef Mike",
    handle: "@chefmike",
    category: "Food",
    title: "The secret to the perfect carbonara 🍝 Wait for the egg drop!",
    likes: "250K",
    comments: "8.9K",
    shares: "32K",
    thumbnail: "https://picsum.photos/seed/food/800/1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
  {
    id: "clip-5",
    author: "Alexey Navolokin",
    handle: "@alexey",
    category: "Predictions",
    title: "My prediction for the US Open finals. Don't miss this pick 🎾",
    likes: "54K",
    comments: "800",
    shares: "1.2K",
    thumbnail: "https://picsum.photos/seed/tennis/800/1200",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  }
];

export default function ClipsDiscoveryPage() {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMuted, setIsMuted] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Match Highlights", "Predictions", "Tech", "Complaints", "Gaming", "Food"];

  const filteredClips = activeCategory === "All" 
    ? MOCK_CLIPS 
    : MOCK_CLIPS.filter(c => c.category === activeCategory);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.more-options-menu')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -700, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 700, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 w-full h-[calc(100vh-80px)] md:h-screen bg-zinc-50/50 flex flex-col items-center overflow-hidden animate-in fade-in duration-300 relative">
      

      {/* Floating Scroll Navigation Arrows (Desktop) */}
      <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
        <button 
          onClick={scrollUp}
          className="w-12 h-12 bg-white rounded-full shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-50 hover:scale-105 transition-all"
          title="Scroll Up"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
        <button 
          onClick={scrollDown}
          className="w-12 h-12 bg-white rounded-full shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-50 hover:scale-105 transition-all"
          title="Scroll Down"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

      {/* Feed Container */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar flex flex-col scroll-smooth"
      >
        {filteredClips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
             <h3 className="text-lg font-bold">No clips found</h3>
          </div>
        ) : (
          filteredClips.map((clip) => (
            <div key={clip.id} className="w-full h-full shrink-0 snap-center flex items-center justify-center p-2 md:p-4">
              <div className="flex items-end gap-2 md:gap-4 h-[90vh] max-h-[850px]">
                
                {/* Video Container */}
                <div className="w-[calc(100vw-80px)] sm:w-[400px] h-full relative rounded-[2rem] shadow-2xl border border-zinc-200 bg-black group">
              
              {/* Auto-playing Video with Poster Fallback */}
              <video 
                src={clip.videoUrl}
                poster={clip.thumbnail}
                autoPlay loop muted={isMuted} playsInline
                className="absolute inset-0 w-full h-full object-cover rounded-[2rem]"
              />

              {/* Top Right Mute Toggle Button */}
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-full shadow-lg hover:bg-black/60 transition-colors"
                >
                  {isMuted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                  )}
                </button>
              </div>

              {/* Unique Glassmorphism Bottom Panel -> Now Transparent */}
              <div className="absolute bottom-4 left-4 right-[60px] sm:right-4 p-4 z-10 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-white/30 shadow-md">
                    {clip.author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[14px] font-bold text-white hover:text-white/80 cursor-pointer transition-colors leading-tight">{clip.author}</h3>
                    <p className="text-[11px] text-white/70 font-semibold">{clip.handle}</p>
                  </div>
                  <button className="ml-auto px-3 py-1 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-sm">
                    Follow
                  </button>
                </div>
                
                <p className="text-sm text-white/90 font-medium leading-snug drop-shadow-md">
                  {clip.title}
                </p>
                
                <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-wider mt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                  <span>Original Audio</span>
                </div>
              </div>

              </div> {/* Close Video Container */}

              {/* Right Side Vertical Action Bar (Responsive: Overlay on mobile, Outside on desktop) */}
              <div className="absolute bottom-24 right-2 sm:relative sm:bottom-auto sm:right-auto py-4 px-2 flex flex-col items-center gap-5 shrink-0 z-30">
                
                <button className="flex flex-col items-center gap-1 group/btn">
                  <div className="w-12 h-12 bg-white rounded-full shadow-md border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-50 transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:fill-red-500 group-hover/btn:stroke-red-500 transition-all"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-700">{clip.likes}</span>
                </button>

                <button className="flex flex-col items-center gap-1 group/btn">
                  <div className="w-12 h-12 bg-white rounded-full shadow-md border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-50 transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:fill-[#00a896] group-hover/btn:stroke-[#00a896] transition-all"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-700">{clip.comments}</span>
                </button>

                <button className="flex flex-col items-center gap-1 group/btn">
                  <div className="w-12 h-12 bg-white rounded-full shadow-md border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-50 transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:stroke-[#FFC82A] transition-all"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-700">{clip.shares}</span>
                </button>

                {/* More Options */}
                <div className="relative more-options-menu mt-2 pt-2 border-t border-zinc-300">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === clip.id ? null : clip.id)}
                    className={`w-12 h-12 bg-white rounded-full shadow-md border flex items-center justify-center transition-colors ${activeMenuId === clip.id ? 'border-zinc-900 text-black shadow-lg' : 'border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-50'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                  </button>

                  {/* Popover Menu outside the card to the right on desktop, left on mobile */}
                  {activeMenuId === clip.id && (
                    <div className="absolute bottom-0 right-14 sm:right-auto sm:left-14 w-[240px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <button className="w-full flex items-center px-4 py-3 hover:bg-red-50 text-sm font-bold text-red-600 transition-colors text-left border-b border-zinc-100">Report</button>
                      <button className="w-full flex items-center px-4 py-3 hover:bg-zinc-50 text-sm font-semibold text-zinc-900 transition-colors text-left">Go to Post</button>
                      <button className="w-full flex items-center px-4 py-3 hover:bg-zinc-50 text-sm font-semibold text-zinc-900 transition-colors text-left">Share to</button>
                      <button className="w-full flex items-center px-4 py-3 hover:bg-zinc-50 text-sm font-semibold text-zinc-900 transition-colors text-left border-b border-zinc-100">Copy link</button>
                      <button className="w-full flex items-center px-4 py-3 hover:bg-zinc-50 text-sm font-semibold text-zinc-900 transition-colors text-left">Embed</button>
                      <button className="w-full flex items-center px-4 py-3 hover:bg-zinc-50 text-sm font-semibold text-zinc-900 transition-colors text-left">About this account</button>
                      <button className="w-full flex items-center px-4 py-3 hover:bg-zinc-50 text-sm font-semibold text-zinc-900 transition-colors text-left">About This Clip</button>
                    </div>
                  )}
                </div>
              </div>
              
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
