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
      
      {/* Header - Light Mode styled */}
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6 shrink-0 z-10 bg-zinc-50/95 backdrop-blur-md border-b border-zinc-200/50">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Clips Discovery</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base mb-6">
          Explore short-form updates, reactions, and highlights from the community.
        </p>
        
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar max-w-full snap-x -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shrink-0 snap-start ${
                activeCategory === cat 
                  ? "bg-black text-white shadow-md" 
                  : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

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
        className="w-full h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar flex flex-col items-center pt-8 pb-32 scroll-smooth"
      >
        {filteredClips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
             <h3 className="text-lg font-bold">No clips found</h3>
          </div>
        ) : (
          filteredClips.map((clip) => (
            <div 
              key={clip.id} 
              className="w-full max-w-[450px] h-[calc(100vh-200px)] min-h-[500px] max-h-[850px] snap-center shrink-0 mb-8 relative rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 bg-black group"
            >
              
              {/* Auto-playing Video with Poster Fallback */}
              <video 
                src={clip.videoUrl}
                poster={clip.thumbnail}
                autoPlay loop muted playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Unique Glassmorphism Top Bar */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <span className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  {clip.category}
                </span>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white text-[10px] font-bold tracking-widest uppercase">Playing</span>
                </div>
              </div>

              {/* Unique Glassmorphism Bottom Panel */}
              <div className="absolute bottom-4 left-4 right-[80px] bg-black/20 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl z-10 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00a896] to-[#FFC82A] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-white/30 shadow-md">
                    {clip.author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[14px] font-bold text-white hover:text-white/80 cursor-pointer transition-colors leading-tight">{clip.author}</h3>
                    <p className="text-[11px] text-white/70 font-semibold">{clip.handle}</p>
                  </div>
                  <button className="ml-auto px-3 py-1 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition-colors">
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

              {/* Right Side Vertical Action Bar (Glassmorphism Pill) */}
              <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-xl border border-white/20 rounded-[2rem] py-4 px-2 flex flex-col items-center gap-5 z-10 shadow-xl">
                
                <button className="flex flex-col items-center gap-1 group/btn">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:fill-red-500 group-hover/btn:stroke-red-500 transition-all"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </div>
                  <span className="text-[10px] font-bold text-white/90">{clip.likes}</span>
                </button>

                <button className="flex flex-col items-center gap-1 group/btn">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:fill-[#00a896] group-hover/btn:stroke-[#00a896] transition-all"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-white/90">{clip.comments}</span>
                </button>

                <button className="flex flex-col items-center gap-1 group/btn">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:stroke-[#FFC82A] transition-all"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </div>
                  <span className="text-[10px] font-bold text-white/90">{clip.shares}</span>
                </button>

                {/* More Options */}
                <div className="relative more-options-menu mt-2 pt-2 border-t border-white/30">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === clip.id ? null : clip.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${activeMenuId === clip.id ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                  </button>

                  {/* Popover Menu inside the card */}
                  {activeMenuId === clip.id && (
                    <div className="absolute bottom-0 right-14 w-[240px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
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
          ))
        )}
      </div>
    </div>
  );
}
