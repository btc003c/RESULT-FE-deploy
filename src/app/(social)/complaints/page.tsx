"use client";

import { useState } from "react";
import PostCard from "@/components/feed/PostCard";
import CreateComplaintModal from "@/components/feed/CreateComplaintModal";

// Rich Mock Data for Complaints Feed
const MOCK_COMPLAINTS = [
  {
    id: "comp-1",
    type: "COMPLAINT",
    author: { name: "Sarah Jenkins", handle: "@sarah_j", initials: "SJ", color: "bg-orange-500", isVerified: false },
    timeAgo: "2h",
    title: "Completely unacceptable delivery service today.",
    description: "I ordered a fragile package and the delivery driver literally tossed it over my fence. Box is smashed and contents are broken. Customer service is putting me on hold for 45 minutes! Has anyone else dealt with this carrier recently?",
    stats: { upvotes: 48, comments: 12 },
    mediaUrls: ["https://images.unsplash.com/photo-1626244795861-12ec8286a9a3?auto=format&fit=crop&q=80&w=800"] // Placeholder for smashed box
  },
  {
    id: "comp-2",
    type: "COMPLAINT",
    author: { name: "David Chen", handle: "@dchen", initials: "DC", color: "bg-red-600", isVerified: true },
    timeAgo: "5h",
    title: "Warning: New OS update bricked my laptop.",
    description: "Do NOT install the version 14.2 update if you are on an M-series chip. It sent my machine into a boot loop and I lost half a day's work. Apple store said they've seen 10 of these today.",
    stats: { upvotes: 892, comments: 156 },
    mediaUrls: ["https://images.unsplash.com/photo-1531297121264-ee4cb889c2fa?auto=format&fit=crop&q=80&w=800"] // Placeholder for laptop/error
  },
  {
    id: "comp-3",
    type: "COMPLAINT",
    author: { name: "Maria Garcia", handle: "@mgarcia", initials: "MG", color: "bg-pink-500", isVerified: false },
    timeAgo: "1d",
    title: "Flight cancelled, no hotel voucher, stranded for 12 hours.",
    description: "Airlines really don't care anymore. Flight 309 got cancelled due to 'staffing issues' (not weather), and they refused to provide any accommodation. Hundreds of us are sleeping on the floor at Terminal B.",
    stats: { upvotes: 215, comments: 45 },
    mediaUrls: ["https://images.unsplash.com/photo-1544015759-22cb6a6b579c?auto=format&fit=crop&q=80&w=800"] // Placeholder for airport
  }
];

export default function ComplaintsFeedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex-1 w-full max-w-[700px] mx-auto animate-in fade-in duration-300 pb-12">
      
      {/* Feed Header */}
      <div className="mb-6 sticky top-0 bg-background/80 backdrop-blur-xl z-10 py-4 border-b border-muted">
        <h1 className="text-2xl font-extrabold text-foreground">Community Complaints</h1>
        <p className="text-sm text-muted-foreground mt-1">Share problems, warn others, and demand better.</p>
      </div>

      {/* Composer Input */}
      <div className="bg-background rounded-2xl shadow-sm border border-red-200 p-4 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0">
            You
          </div>
          <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 bg-muted/50 rounded-full px-4 py-3 cursor-text hover:bg-muted transition-colors border border-transparent hover:border-red-100"
          >
             <span className="text-muted-foreground font-medium text-sm">Did you have a bad experience? Share it...</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4 ml-14 border-t border-muted/50 pt-3">
           <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="flex items-center gap-2 text-foreground/80 font-semibold text-sm hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors group"
           >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
             Report Issue
           </button>
           <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="flex items-center gap-2 text-foreground/80 font-semibold text-sm hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors group"
           >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
             Add Photo
           </button>
        </div>
      </div>

      {/* Complaints Feed List */}
      <div className="space-y-4">
        {MOCK_COMPLAINTS.map(complaint => (
          <PostCard key={complaint.id} post={complaint as any} />
        ))}
      </div>

      <CreateComplaintModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
