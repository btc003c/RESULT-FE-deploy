"use client";

import { useState, useEffect, useRef } from "react";
import RightSidebar from "@/components/feed/RightSidebar";
import PostCard from "@/components/feed/PostCard";
import CreatePostModal from "@/components/feed/CreatePostModal";
import { api, getAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";

// Helper function for relative time
function getTimeAgo(dateStr: string | null) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function HomeFeedPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<"UPDATE" | "CLIPS" | "POLL" | "LIVE" | "FLASH">("UPDATE");
  const [posts, setPosts] = useState<any[]>([]);
  const [liveStories, setLiveStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const storiesScrollRef = useRef<HTMLDivElement>(null);

  const scrollStories = (dir: 'left' | 'right') => {
    if (storiesScrollRef.current) {
      storiesScrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async (cursor?: string) => {
    try {
      if (cursor) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      
      const res = await api.feed.getTimeline(cursor, 20);
      
      if (!cursor) {
        let stories = res.liveStories || [];
        try {
          const [cRes, fRes] = await Promise.all([
            fetch('/api/sports/cricket?endpoint=currentMatches'),
            fetch('/api/sports/football?status=inprogress')
          ]);
          
          let cricketStories = [];
          if (cRes.ok) {
            const cData = await cRes.json();
            if (cData.status === 'success' && cData.data) {
              cricketStories = cData.data.filter((m: any) => m.matchStarted && !m.matchEnded).map((m: any) => {
                const teamA = m.teams?.[0] || 'TBA';
                const teamB = m.teams?.[1] || 'TBA';
                return {
                  id: `cricket-${m.id}`,
                  title: `${teamA.substring(0,3)} v ${teamB.substring(0,3)}`.toUpperCase(),
                  hasUnread: true,
                  avatarText: '🏏',
                  bgColor: 'bg-emerald-100',
                  href: '/results/sports/cricket'
                };
              });
            }
          }

          let footballStories: any[] = [];
          if (fRes.ok) {
            const fData = await fRes.json();
            if (fData.success && fData.data) {
              fData.data.forEach((league: any) => {
                if (league.matches) {
                  league.matches.forEach((m: any) => {
                    footballStories.push({
                      id: `fb-${m.id}`,
                      title: `${(m.teams?.home?.name || 'H').substring(0,3)} v ${(m.teams?.away?.name || 'A').substring(0,3)}`.toUpperCase(),
                      hasUnread: true,
                      avatarText: '⚽',
                      bgColor: 'bg-blue-100',
                      href: '/results/sports/football'
                    });
                  });
                }
              });
            }
          }

          stories = [...footballStories, ...cricketStories, ...stories];
        } catch (e) {
          console.error("Failed to fetch sports stories", e);
        }
        setLiveStories(stories);
      }
      
      // Map backend DTO to frontend structure
      const mappedPosts = (res.items || res.content || []).map((p: any) => ({
        id: p.id,
        type: p.postType || p.type || "DISCUSSION", // COMPLAINT, POLL, DISCUSSION, UPDATE, IMAGE, VIDEO, RESULT
        author: { 
          name: p.authorName || "Unknown", 
          handle: p.authorHandle || "@user", 
          initials: (p.authorName || "U")[0], 
          color: "bg-blue-100 text-blue-600", 
          isVerified: p.isAuthorVerified || false 
        },
        timeAgo: getTimeAgo(p.createdAt),
        location: p.payload?.locationName || null,
        title: p.payload?.title || p.payload?.question || (p.postType === 'COMPLAINT' ? 'Complaint' : 'Update'),
        description: p.payload?.description || p.payload?.content || p.payload?.text,
        pollOptions: p.payload?.options,
        mediaUrls: p.payload?.mediaUrls || [],
        stats: { upvotes: p.payload?.upvotes || p.likeCount || 0, comments: p.commentCount || 0 },
        isBookmarked: p.isBookmarked,
        isUpvoted: p.isLiked || false,
        payload: p.payload
      }));
      
      setPosts(prev => cursor ? [...prev, ...mappedPosts] : mappedPosts);
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
      
    } catch (error) {
      console.error("Failed to fetch feed:", error);
      if (!cursor) {
        setLiveStories([]);
        setPosts([]);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const openCreateModal = (type: "UPDATE" | "CLIPS" | "POLL" | "LIVE" | "FLASH") => {
    if (!getAuthToken()) {
      router.push('/login');
      return;
    }
    setModalDefaultType(type);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex lg:gap-12 w-full">
      
      {/* Center Feed */}
      <div className="flex-1 min-w-0 transition-all duration-300">
          
          {/* Top Story Balls (Flashes and Matches) */}
          <div className="pt-4 mb-6 relative group">
            {/* Scroll Arrows */}
            <button onClick={() => scrollStories('left')} className="absolute left-0 top-[28%] z-30 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all opacity-0 group-hover:opacity-100 -ml-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scrollStories('right')} className="absolute right-0 top-[28%] z-30 w-8 h-8 bg-white border border-zinc-200 rounded-full shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-all opacity-0 group-hover:opacity-100 -mr-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            
            <div ref={storiesScrollRef} className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar items-center px-4 md:px-1 scroll-smooth w-full">
              
              {/* Your Story (Create) */}
              <div className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95 relative mr-2">
                <div className="relative rounded-full">
                  <div className="relative z-10 w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center bg-zinc-100 border border-zinc-200">
                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                       <span className="text-3xl text-zinc-400">👤</span>
                    </div>
                  </div>
                  {/* Plus Icon Badge */}
                  <div className="absolute bottom-1 right-0 z-20 bg-blue-500 text-white rounded-full border-[3px] border-background w-6 h-6 flex items-center justify-center shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-zinc-500 tracking-tight truncate max-w-[70px] text-center">Your Story</span>
              </div>

              {/* Full Line of Flashes & Live Stories */}
              {[
                { id: 'l1', type: 'live', title: 'ind_aus_live', img: 'https://loremflickr.com/150/150/cricket' },
                { id: 'l2', type: 'live', title: 'election_26', img: 'https://loremflickr.com/150/150/election' },
                { id: 'l3', type: 'live', title: 'rma_bar_live', img: 'https://loremflickr.com/150/150/soccer' },
                { id: 'l4', type: 'live', title: 'campus_news', img: 'https://loremflickr.com/150/150/campus' },
                { id: 'f1', type: 'flash', title: 'sportsdaily', img: 'https://loremflickr.com/150/150/sports' },
                { id: 'f2', type: 'flash', title: 'edutech_hub', img: 'https://loremflickr.com/150/150/education' },
                { id: 'f3', type: 'flash', title: 'jane_doe', img: 'https://loremflickr.com/150/150/woman' },
                { id: 'f4', type: 'flash', title: 'esports_now', img: 'https://loremflickr.com/150/150/gaming' },
                { id: 'f5', type: 'flash', title: 'news_now', img: 'https://loremflickr.com/150/150/news' },
                { id: 'f6', type: 'flash', title: 'tech_talk', img: 'https://loremflickr.com/150/150/technology' },
                { id: 'f7', type: 'flash', title: 'market_wrap', img: 'https://loremflickr.com/150/150/finance' },
                { id: 'f8', type: 'flash', title: 'the_creator', img: 'https://loremflickr.com/150/150/youtube' },
              ].map(story => (
                <div key={story.id} className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95 group/story relative">
                  <div className="relative rounded-full p-[3px]">
                    
                    {/* Ring Logic */}
                    {story.type === 'flash' ? (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFC82A] to-[#00A896]"></div>
                    ) : (
                      <div className="absolute inset-0 rounded-full bg-red-500"></div>
                    )}
                    
                    <div className="relative z-10 w-[68px] h-[68px] rounded-full border-[3px] border-background overflow-hidden flex items-center justify-center bg-zinc-100">
                      <img src={story.img} alt={story.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Live Pill */}
                    {story.type === 'live' && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-red-500 text-white text-[9px] font-bold tracking-wider px-1.5 py-[1px] rounded-[4px] border-2 border-background shadow-sm">
                        LIVE
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-zinc-800 tracking-tight truncate max-w-[72px] text-center">{story.title}</span>
                </div>
              ))}



            </div>
          </div>
          
          {/* Feed Posts */}
          <div className="space-y-4 mb-12">
            {isLoading && !isLoadingMore ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-background rounded-2xl border border-muted p-5 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-muted rounded w-1/3" />
                        <div className="h-2.5 bg-muted rounded w-1/4" />
                      </div>
                      <div className="h-5 w-16 bg-muted rounded-full" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-muted rounded w-4/5" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                    <div className="flex gap-4 pt-3 border-t border-muted/50">
                      <div className="h-5 w-12 bg-muted rounded" />
                      <div className="h-5 w-12 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                {posts.map(post => (
                   <PostCard key={post.id} post={post} />
                ))}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                     <button 
                       onClick={() => fetchFeed(nextCursor!)}
                       disabled={isLoadingMore}
                       className="px-6 py-2.5 rounded-full font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50"
                     >
                       {isLoadingMore ? "Loading..." : "Load More"}
                     </button>
                  </div>
                )}
              </>
            ) : null}
            {posts.length === 0 && !isLoading && !isLoadingMore && (
              <>
                {[
                  {
                    id: "mock1",
                    type: "UPDATE",
                    author: { name: "VDart", handle: "@vdart", initials: "VD", color: "bg-blue-600", isVerified: true },
                    timeAgo: "1d",
                    title: "Football fever met VDart energy. ⚽💙",
                    description: "Our office FIFA Watch Party brought VDartians together for match excitement. Because the best moments are even better when shared as One VDart 🌍",
                    stats: { upvotes: 132, comments: 1 },
                    mediaUrls: ["https://images.unsplash.com/photo-1528081682859-994364023249?auto=format&fit=crop&q=80&w=1000"]
                  },
                  {
                    id: "mock2",
                    type: "UPDATE",
                    author: { name: "Ankur Kesharwani", handle: "@ankur", initials: "AK", color: "bg-amber-600", isVerified: true },
                    timeAgo: "1d",
                    title: "7 years of experience. Strong resume. Multiple projects.",
                    description: "Yet many software engineers still struggle to get Senior SDE offers ‼️ Let's talk about the missing pieces in system design and leadership that interviewers look for.",
                    stats: { upvotes: 208, comments: 40 },
                    mediaUrls: ["https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=1000"]
                  },
                  {
                    id: "mock3",
                    type: "UPDATE",
                    author: { name: "Alexey Navolokin", handle: "@alexey", initials: "AN", color: "bg-purple-600", isVerified: true },
                    timeAgo: "1d",
                    title: "Sometimes, the most unexpected things happen for a reason. Would you agree?",
                    description: "In business and in life, not every setback is a failure. Sometimes it's exactly what you need to redirect your path. Keep moving forward.",
                    stats: { upvotes: 644, comments: 75 },
                    mediaUrls: ["https://images.unsplash.com/photo-1518605368461-1ee7e550c609?auto=format&fit=crop&q=80&w=1000"]
                  }
                ].map(mockPost => (
                  <PostCard key={mockPost.id} post={mockPost as any} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
      <RightSidebar />

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        defaultType={modalDefaultType} 
        onPostCreated={fetchFeed}
      />
    </div>
  );
}
