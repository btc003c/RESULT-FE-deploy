"use client";

import { useState, useRef, useEffect } from "react";

// Mock Video Data
const MOCK_CLIPS = [
  {
    id: "c1",
    author: "Jane Doe",
    handle: "@janedoe",
    description: "The sunset in Santorini is unreal! 🌅 #travel #sunset",
    music: "Original Audio - Jane Doe",
    likes: "1.2M",
    comments: "45K",
    shares: "12K",
    bgColor: "bg-slate-900", // placeholder for video background
  },
  {
    id: "c2",
    author: "Tech Insider",
    handle: "@techinsider",
    description: "Unboxing the new quantum smartphone. This thing is fast! 📱⚡",
    music: "Tech Beats 2026 - Creator",
    likes: "800K",
    comments: "12K",
    shares: "5K",
    bgColor: "bg-zinc-900",
  },
  {
    id: "c3",
    author: "Chef Mike",
    handle: "@chefmike",
    description: "The secret to the perfect carbonara 🍝 Wait for the egg drop!",
    music: "Italian Cafe Music - Acoustic",
    likes: "2.5M",
    comments: "88K",
    shares: "200K",
    bgColor: "bg-stone-900",
  }
];

export default function ClipsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle scroll snapping detection
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
        setActiveIndex(index);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="flex-1 w-full h-[calc(100vh-80px)] md:h-screen bg-black overflow-hidden relative">
      
      {/* Floating Header */}
      <div className="absolute top-6 left-0 w-full z-20 flex justify-center gap-6 text-white/80 font-bold text-lg drop-shadow-md">
        <button className="hover:text-white transition-colors">Following</button>
        <div className="w-1 h-1 bg-white/50 rounded-full mt-3"></div>
        <button className="text-white border-b-2 border-white pb-1">For You</button>
      </div>

      {/* Vertical Scroll Container */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        {MOCK_CLIPS.map((clip, index) => (
          <div key={clip.id} className="w-full h-full snap-start relative flex items-center justify-center bg-black">
            
            {/* Mock Video Container */}
            <div className={`w-full max-w-[450px] h-full sm:h-[90%] sm:rounded-2xl ${clip.bgColor} relative overflow-hidden flex items-center justify-center group`}>
               
               {/* Play placeholder icon (appears briefly or when paused, simplified for mockup) */}
               <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
               </div>

               {/* Right Side Actions */}
               <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
                 {/* Profile */}
                 <div className="w-12 h-12 rounded-full border-2 border-white bg-zinc-800 flex items-center justify-center text-white font-bold mb-2 cursor-pointer hover:scale-110 transition-transform relative">
                   {clip.author.charAt(0)}
                   <div className="absolute -bottom-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                   </div>
                 </div>

                 {/* Like */}
                 <button className="flex flex-col items-center gap-1 group">
                   <div className="p-3 bg-black/20 rounded-full backdrop-blur-sm group-hover:bg-black/40 transition-colors">
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                   </div>
                   <span className="text-white text-xs font-bold drop-shadow-md">{clip.likes}</span>
                 </button>

                 {/* Comment */}
                 <button className="flex flex-col items-center gap-1 group">
                   <div className="p-3 bg-black/20 rounded-full backdrop-blur-sm group-hover:bg-black/40 transition-colors">
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                   </div>
                   <span className="text-white text-xs font-bold drop-shadow-md">{clip.comments}</span>
                 </button>

                 {/* Share */}
                 <button className="flex flex-col items-center gap-1 group">
                   <div className="p-3 bg-black/20 rounded-full backdrop-blur-sm group-hover:bg-black/40 transition-colors">
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                   </div>
                   <span className="text-white text-xs font-bold drop-shadow-md">{clip.shares}</span>
                 </button>
               </div>

               {/* Bottom Info */}
               <div className="absolute left-4 bottom-6 right-20 z-10 text-white">
                 <h3 className="font-bold text-lg drop-shadow-md">{clip.author} <span className="font-normal text-sm opacity-80">{clip.handle}</span></h3>
                 <p className="text-sm mt-2 mb-3 drop-shadow-md line-clamp-2">{clip.description}</p>
                 
                 <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[spin_4s_linear_infinite]"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                   <span className="truncate">{clip.music}</span>
                 </div>
               </div>

               {/* Active state overlay (simulating video progress) */}
               {activeIndex === index && (
                 <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                   <div className="h-full bg-white/80 animate-[progress_15s_linear] w-[0%]" style={{ animationFillMode: 'forwards' }}></div>
                 </div>
               )}

            </div>
          </div>
        ))}
      </div>
      
      {/* Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}} />
    </div>
  );
}
