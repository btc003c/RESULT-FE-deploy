"use client";

import Link from "next/link";

interface PostCardProps {
  id: string;
  type: "COMPLAINT" | "POLL" | "DISCUSSION" | "UPDATE" | "IMAGE" | "VIDEO" | "RESULT" | string;
  author: {
    name: string;
    handle: string;
    initials: string;
    color: string;
    isVerified?: boolean;
  };
  timeAgo: string;
  location?: string;
  title: string;
  description?: string;
  pollOptions?: { label: string; percentage: number; isWinner: boolean }[];
  stats: {
    upvotes: number;
    comments: number;
  };
  isBookmarked?: boolean;
  isUpvoted?: boolean;
  mediaUrls?: string[];
}

import { useState } from "react";
import { api, API_BASE_URL } from "@/lib/api";
import { AtomLogo } from "@/components/ui/Logos";

export default function PostCard({ post }: { post: PostCardProps }) {
  const [isUpvoted, setIsUpvoted] = useState(post.isUpvoted || false);
  const [upvotes, setUpvotes] = useState(post.stats.upvotes || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isDisagreed, setIsDisagreed] = useState(false);
  const [downvotes, setDownvotes] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const [replyType, setReplyType] = useState<"COMMENT" | "SOLUTION" | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      if (post.type === "COMPLAINT") {
        if (isUpvoted) {
          await api.complaints.removeUpvote(post.id);
        } else {
          await api.complaints.upvote(post.id);
        }
      } else if (post.type === "DISCUSSION") {
        if (isUpvoted) {
          await api.posts.removeUpvote(post.id);
        } else {
          await api.posts.upvote(post.id);
        }
      }
      
      // We don't have upvotes for POLL and RESULT mapped yet
      setUpvotes(prev => isUpvoted ? prev - 1 : prev + 1);
      setIsUpvoted(!isUpvoted);
    } catch (err) {
      console.error("Failed to toggle upvote", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      if (post.type === "COMPLAINT") {
        if (isBookmarked) {
          await api.complaints.removeBookmark(post.id);
        } else {
          await api.complaints.bookmark(post.id);
        }
      } else {
        if (isBookmarked) {
          await api.posts.removeBookmark(post.id);
        } else {
          await api.posts.bookmark(post.id);
        }
      }
      
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    } finally {
      setIsLoading(false);
    }
  };

  const typeColors: Record<string, string> = {
    COMPLAINT: "bg-amber-100 text-amber-800",
    POLL: "bg-primary/10 text-primary",
    DISCUSSION: "bg-blue-100 text-blue-800",
    UPDATE: "bg-zinc-100 text-zinc-800",
    IMAGE: "bg-pink-100 text-pink-800",
    VIDEO: "bg-purple-100 text-purple-800",
    RESULT: "bg-emerald-100 text-emerald-800"
  };

  return (
    <article className="bg-background rounded-2xl shadow-sm border border-muted p-5 hover:border-primary/30 transition-colors cursor-pointer block relative">
      <Link href={`/post/${post.id}`} className="absolute inset-0 z-0" aria-label="View post" />
      
      <div className="relative z-10 flex items-center justify-between mb-4">
         <div className="flex items-center gap-3">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${post.author.color}`}>
             {post.author.name === "BindTime Official" ? (
               <img src="/brand-logo-clear.png" alt="BindTime Logo" className="w-full h-full" />
             ) : (
               post.author.initials
             )}
           </div>
           <div>
             <div className="flex items-center gap-1">
               <h4 className="font-bold text-sm">{post.author.name}</h4>
               {post.author.isVerified && <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" strokeWidth="2"><polygon points="12 2 15.09 5.09 19.5 5.5 19.91 9.91 23 12 19.91 14.09 19.5 18.5 15.09 18.91 12 22 8.91 18.91 4.5 18.5 4.09 14.09 1 12 4.09 9.91 4.5 5.5 8.91 5.09 12 2"></polygon></svg>}
             </div>
             <p className="text-[11px] text-muted-foreground">{post.location ? `${post.location} • ` : ""}{post.timeAgo}</p>
           </div>
         </div>
         <span className={`${typeColors[post.type] || typeColors["UPDATE"]} text-[10px] font-bold px-2 py-1 rounded-full tracking-wider`}>
           {post.type}
         </span>
      </div>

      <div className="relative z-10">
        <h3 className="font-black text-[17px] mb-2 leading-tight">{post.title}</h3>
        {post.description && (
          <p className="text-sm text-foreground/80 mb-4 line-clamp-3 leading-relaxed">{post.description}</p>
        )}

        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className={`grid gap-2 mb-4 rounded-xl overflow-hidden ${post.mediaUrls.length === 1 ? 'grid-cols-1' : post.mediaUrls.length === 2 ? 'grid-cols-2' : post.mediaUrls.length === 3 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'}`}>
            {post.mediaUrls.map((url, i) => (
              <div key={i} className={`relative w-full min-h-[150px] max-h-[300px] bg-muted/30 ${post.mediaUrls && post.mediaUrls.length === 3 && i === 0 ? "col-span-2 row-span-2" : ""}`}>
                <img 
                  src={url.startsWith('http') ? url : `${API_BASE_URL}${url}`} 
                  alt="Post media" 
                  className="w-full h-full object-cover rounded-lg border border-muted" 
                />
              </div>
            ))}
          </div>
        )}

        {post.type === "POLL" && post.pollOptions && (
          <div className="space-y-2 mb-4 pointer-events-none">
             {post.pollOptions.map((opt, i) => (
               <div key={i} className={`relative h-10 border rounded-lg overflow-hidden flex items-center px-4 ${opt.isWinner ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/30 border-muted'}`}>
                 <div className={`absolute top-0 left-0 bottom-0 z-0 ${opt.isWinner ? 'bg-primary/20' : 'bg-muted'}`} style={{ width: `${opt.percentage}%` }}></div>
                 <span className="relative z-10 font-bold text-sm">{opt.label}</span>
                 <span className="relative z-10 ml-auto font-bold text-sm">{opt.percentage}%</span>
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="relative z-20 flex items-center justify-between border-t border-muted/50 pt-3 mt-2">
         <div className="flex items-center gap-1 sm:gap-4">
           {/* Agree */}
           <button 
             onClick={(e) => {
               if (isDisagreed) setIsDisagreed(false);
               handleUpvote(e);
             }}
             disabled={isLoading}
             className={`flex items-center gap-0.5 transition-colors group ${isUpvoted ? 'text-emerald-500' : 'text-muted-foreground hover:text-emerald-500'}`}
           >
             <div className={`p-1.5 rounded-full ${isUpvoted ? 'bg-emerald-500/10' : 'group-hover:bg-emerald-500/10'}`}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill={isUpvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
             </div>
             <span className="font-bold text-sm">{upvotes}</span>
           </button>

           {/* Disagree */}
           <button 
             onClick={(e) => { 
               e.preventDefault(); e.stopPropagation(); 
               if (isUpvoted) { handleUpvote(e); } 
               setDownvotes(prev => isDisagreed ? prev - 1 : prev + 1);
               setIsDisagreed(!isDisagreed); 
             }}
             className={`flex items-center gap-0.5 transition-colors group ${isDisagreed ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
           >
             <div className={`p-1.5 rounded-full ${isDisagreed ? 'bg-red-500/10' : 'group-hover:bg-red-500/10'}`}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill={isDisagreed ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
             </div>
             <span className="font-bold text-sm">{downvotes}</span>
           </button>
         
         <div className="relative">
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowActions(!showActions); }}
             className={`flex items-center gap-0.5 transition-colors group ${showActions ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
           >
             <div className={`p-1.5 rounded-full ${showActions ? 'bg-primary/10' : 'group-hover:bg-primary/10'}`}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
             </div>
             <span className="font-bold text-sm">{post.stats.comments}</span>
           </button>

           {post.type === "COMPLAINT" && (
             <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-white border border-zinc-100 shadow-xl rounded-[14px] p-1.5 flex flex-col gap-0.5 transition-all z-50 ${showActions ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'}`}>
               <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReplyType("COMMENT"); setShowActions(false); }} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 font-bold text-xs transition-colors whitespace-nowrap">
                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                 Comment
               </button>
               <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReplyType("SOLUTION"); setShowActions(false); }} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 text-zinc-700 hover:text-emerald-600 font-bold text-xs transition-colors whitespace-nowrap">
                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 Solve
               </button>
             </div>
           )}
         </div>

           {/* Favourite */}
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFavourite(!isFavourite); }}
             className={`flex items-center gap-1.5 transition-colors group ${isFavourite ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-500'}`}
           >
             <div className={`p-1.5 rounded-full ${isFavourite ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/10'}`}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavourite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
             </div>
           </button>

           {/* Share */}
           <button className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-500 transition-colors group">
             <div className="p-1.5 rounded-full group-hover:bg-blue-500/10">
               <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
             </div>
           </button>
         </div>

         <button 
           onClick={handleBookmark}
           disabled={isLoading}
           className={`flex items-center gap-1.5 ml-auto transition-colors group ${isBookmarked ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
         >
           <div className={`p-1.5 rounded-full ${isBookmarked ? 'bg-amber-500/10' : 'group-hover:bg-amber-500/10'}`}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
           </div>
         </button>
      </div>

      {replyType && (
        <div className="relative z-20 mt-4 pt-4 border-t border-zinc-100 flex gap-3 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
          <div className="w-8 h-8 rounded-full bg-zinc-200 shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs text-zinc-500">
            Me
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={replyType === "SOLUTION" ? "Propose a solution to this issue..." : "Write a comment..."}
              className={`w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:bg-white resize-none min-h-[80px] transition-all ${replyType === "SOLUTION" ? "focus:ring-emerald-500/20 focus:border-emerald-500" : "focus:ring-primary/20 focus:border-primary"}`}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReplyType(null); setReplyText(""); }}
                className="px-4 py-1.5 text-xs font-bold text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={!replyText.trim()}
                className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${replyType === "SOLUTION" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-primary hover:bg-primary/90"}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReplyType(null); setReplyText(""); }}
              >
                {replyType === "SOLUTION" ? "Post Solution" : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
