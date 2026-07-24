"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

export default function FloatingChatWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="w-14 h-14 rounded-2xl bg-white text-black border border-zinc-200 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
