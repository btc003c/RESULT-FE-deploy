"use client";

import { useState, useEffect, ReactNode, useRef } from "react";
import { api, clearAuthToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import EditProfileDrawer from "@/components/profile/EditProfileDrawer";
import FollowersModal from "@/components/profile/FollowersModal";
import CreatePostModal from "@/components/feed/CreatePostModal";
import Link from "next/link";

type Tab = "posts" | "clips" | "saved" | "tagged" | "result" | "complaint";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  bio?: string;
  website?: string;
  city?: string;
  profilePictureBase64?: string;
  coverPictureBase64?: string;
  organizationType?: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
}

const fmtNum = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

const GRADIENTS = [
  "from-violet-600 to-indigo-700",
  "from-rose-500 to-pink-700",
  "from-amber-500 to-orange-700",
  "from-emerald-500 to-teal-700",
  "from-blue-500 to-cyan-700",
];
const pickGradient = (name = "") => GRADIENTS[(name.charCodeAt(0) || 0) % GRADIENTS.length];

/* ─── Profile Completion Meter ────────────────────────── */
function ProfileCompletion({ profile, onEdit }: { profile: UserProfile; onEdit: () => void }) {
  const fields = [
    { label: "Name", done: !!profile.name },
    { label: "Bio", done: !!profile.bio },
    { label: "Photo", done: !!profile.profilePictureBase64 },
    { label: "Website", done: !!profile.website },
    { label: "Phone", done: !!profile.phoneNumber },
    { label: "City", done: !!profile.city },
  ];
  const done = fields.filter(f => f.done).length;
  const pct = Math.round((done / fields.length) * 100);
  if (pct === 100) return null;

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-black text-zinc-900">Complete your profile</p>
            <p className="text-xs text-zinc-400 mt-0.5">{done} of {fields.length} fields filled</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FFC82A]/10 flex items-center justify-center">
            <span className="text-sm font-black text-[#FFC82A]">{pct}%</span>
          </div>
        </div>
        {/* Bar */}
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#FFC82A] to-violet-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Missing items */}
        <div className="flex flex-wrap gap-2">
          {fields.filter(f => !f.done).map(f => (
            <button
              key={f.label}
              onClick={onEdit}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-full text-[11px] font-bold text-zinc-500 hover:border-[#FFC82A] hover:text-[#FFC82A] hover:bg-[#FFC82A]/5 transition-all"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}



/* ─── Inline followers ──────────────────────────────── */
function FollowInline({ userId, mode }: { userId: string; mode: "followers" | "following" }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (mode === "followers" ? api.users.getFollowers(userId) : api.users.getFollowing(userId))
      .then(d => setUsers(d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, mode]);

  if (loading) return (
    <div className="space-y-3 animate-pulse p-4">
      {[1,2,3].map(i => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 shrink-0" />
          <div className="flex-1 space-y-1.5"><div className="h-3 bg-zinc-200 rounded-full w-2/5" /><div className="h-2.5 bg-zinc-100 rounded-full w-1/3" /></div>
        </div>
      ))}
    </div>
  );
  if (users.length === 0) return (
    <div className="flex flex-col items-center py-10 text-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <p className="text-sm font-bold text-zinc-400">No {mode} yet</p>
      <p className="text-xs text-zinc-300 mt-1">When people {mode === "followers" ? "follow you" : "are followed by you"}, they appear here</p>
    </div>
  );
  return (
    <div className="divide-y divide-zinc-50">
      {users.map(u => {
        const init = u.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
        return (
          <Link key={u.id} href={`/profile/${u.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-50/80 transition-colors group">
            <div className={`w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${pickGradient(u.name)} text-white font-black text-sm flex items-center justify-center shrink-0`}>
              {u.profilePictureBase64 ? <img src={`data:image/jpeg;base64,${u.profilePictureBase64}`} className="w-full h-full object-cover" alt="" /> : init}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-800 truncate group-hover:text-[#FFC82A] transition-colors">{u.name}</p>
              {u.bio && <p className="text-xs text-zinc-400 truncate">{u.bio}</p>}
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-200 group-hover:text-[#FFC82A] transition-colors shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Skeleton ─────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="w-full animate-pulse -mx-2 sm:-mx-4 lg:-mx-6">
      <div className="h-56 lg:h-72 w-full bg-zinc-200" />
      <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
        <div className="flex items-end gap-4 -mt-16 mb-6">
          <div className="w-32 h-32 rounded-full bg-zinc-300 ring-4 ring-white shrink-0" />
          <div className="flex-1 pb-2 space-y-2">
            <div className="h-6 w-52 bg-zinc-200 rounded-full" /><div className="h-4 w-36 bg-zinc-100 rounded-full" />
          </div>
          <div className="w-32 h-10 bg-zinc-200 rounded-full shrink-0 mb-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-zinc-100 rounded-2xl" />)}</div>
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-zinc-100 rounded-2xl" />)}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────── */
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("posts");
  const [editOpen, setEditOpen] = useState(false);
  const [followModal, setFollowModal] = useState<{ open: boolean; mode: "followers" | "following" }>({ open: false, mode: "followers" });
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const followScrollRef = useRef<HTMLDivElement>(null);
  
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = (reader.result as string).split(",")[1];
      try {
        const res = await api.users.updateMe({ name: profile?.name || "", profilePictureBase64: base64String });
        if (res.data) setProfile(res.data);
      } catch (err) {
        console.error("Failed to upload profile picture, updating locally", err);
        if (profile) setProfile({ ...profile, profilePictureBase64: base64String });
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = (reader.result as string).split(",")[1];
      try {
        const res = await api.users.updateMe({ name: profile?.name || "", coverPictureBase64: base64String });
        if (res.data) setProfile(res.data);
      } catch (err) {
        console.error("Failed to upload cover, updating locally", err);
        if (profile) setProfile({ ...profile, coverPictureBase64: base64String });
      }
    };
    reader.readAsDataURL(file);
  };
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [showTabs, setShowTabs] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateTabsVisibility = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 350) {
        setShowTabs(false); // Scroll down deep -> hide
      } else {
        setShowTabs(true); // Scroll up or near top -> show
      }
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateTabsVisibility);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    clearAuthToken();
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem('rh_token');
    
    // If no token, immediately fallback to mock data to prevent global 401 redirect
    if (!token || token === 'undefined' || token === 'null') {
      setProfile({
        id: "mock-1",
        name: "Alexey Navolokin",
        email: "alexey@resulthub.com",
        role: "PRO PREDICTOR",
        bio: "Tech enthusiast and sports fanatic. Turning predictions into perfection. I spend my days analyzing data to find the best possible outcomes in both technology trends and major sporting events. Join me on my journey as I share insights, daily tips, and deep dives into the mechanics of success.",
        city: "San Francisco, CA",
        followerCount: 14200,
        followingCount: 340,
        postCount: 89,
      });
      setLoading(false);
      return;
    }

    api.users.getMe()
      .then(d => setProfile(d))
      .catch(() => {
        // Fallback to a rich mock profile so the user can see the UI design
        setProfile({
          id: "mock-1",
          name: "Alexey Navolokin",
          email: "alexey@resulthub.com",
          role: "PRO PREDICTOR",
          bio: "Tech enthusiast and sports fanatic. Turning predictions into perfection. I spend my days analyzing data to find the best possible outcomes in both technology trends and major sporting events. Join me on my journey as I share insights, daily tips, and deep dives into the mechanics of success.",
          city: "San Francisco, CA",
          followerCount: 14200,
          followingCount: 340,
          postCount: 89,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (!profile) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-base font-bold text-zinc-600">{error || "Profile not found."}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#FFC82A] text-white text-sm font-bold rounded-full">Retry</button>
    </div>
  );

  const gr = pickGradient(profile.name);
  const initials = profile.name?.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const followerCount = profile.followerCount ?? 0;
  const followingCount = profile.followingCount ?? 0;
  const postCount = profile.postCount ?? 0;

  const TABS: { key: Tab; label: string; icon: ReactNode }[] = [
    { key: "posts", label: "Posts", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> },
    { key: "clips", label: "Clips", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg> },
    { key: "saved", label: "Saved", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg> },
    { key: "tagged", label: "Tagged", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> },
    { key: "result", label: "Result", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { key: "complaint", label: "Complaint", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  ];

  const FLASHBACKS = [
    { id: "1", title: "Highlights", img: "https://loremflickr.com/150/150/party" },
    { id: "2", title: "Gym", img: "https://loremflickr.com/150/150/gym" },
    { id: "3", title: "Travel", img: "https://loremflickr.com/150/150/beach" },
    { id: "4", title: "Food", img: "https://loremflickr.com/150/150/food" },
    { id: "5", title: "Vibes", img: "https://loremflickr.com/150/150/smile" },
    { id: "6", title: "Events", img: "https://loremflickr.com/150/150/concert" },
    { id: "7", title: "Pets", img: "https://loremflickr.com/150/150/dog" },
    { id: "8", title: "Art", img: "https://loremflickr.com/150/150/art" },
  ];

  return (
    <div className="w-full min-h-screen pb-10 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full max-w-[1920px] mx-auto gap-x-4 px-4 lg:px-0 pt-4 pb-3">
        <div className="lg:col-span-2 flex items-center justify-between">
          <h2 className="text-xl font-black text-zinc-500">{profile.name}</h2>
          
          <div className="hidden md:flex items-center bg-white border border-zinc-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#FFC82A] focus-within:border-transparent transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 mr-2 shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" placeholder="Search profile..." className="bg-transparent border-none outline-none text-sm font-semibold text-zinc-700 w-48 placeholder:text-zinc-400" />
          </div>
        </div>

        <div className="lg:col-span-1 flex items-center justify-end">
          <div className="flex md:hidden items-center gap-4">
            <Link href="/bookmarks" className="text-zinc-400 hover:text-zinc-800 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </Link>
            <button onClick={() => setSettingsOpen(true)} className="text-zinc-400 hover:text-zinc-800 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>
      </div>
      {/* ══════════════════════════════════════
          TOP SECTION GRID (Cover, Flashbacks, Info, Follow)
          ══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full max-w-[1920px] mx-auto gap-y-4 lg:gap-y-0 lg:gap-x-4">
        
        {/* Cover Image */}
        <div className="order-1 lg:order-1 lg:col-span-2 relative w-full h-64 lg:h-[240px] overflow-hidden bg-zinc-900 group lg:rounded-2xl">
          {profile.coverPictureBase64 ? (
            <img src={`data:image/jpeg;base64,${profile.coverPictureBase64}`} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          ) : (
             <img src="https://loremflickr.com/1200/400/sports" alt="Cover Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          )}
          {/* Edit Cover icon */}
          <div className="absolute bottom-4 right-4">
            <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={handleCoverUpload} />
            <button onClick={() => coverInputRef.current?.click()} className="flex items-center justify-center w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-white transition-all shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
          </div>
        </div>

        {/* FlashBacks */}
        <div className="order-3 lg:order-2 lg:col-span-1 relative w-full h-auto lg:h-[240px] lg:-mt-14 bg-white rounded-none lg:rounded-2xl border-b lg:border-b-0 lg:border-l lg:border-zinc-100 flex flex-col pt-4 overflow-hidden">
          <div className="px-4 lg:px-8 shrink-0">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">FlashBacks</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-4">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2 gap-y-3 justify-items-center">
              {/* Add New FlashBack */}
              <div className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-[3px] border-dashed border-zinc-300 flex items-center justify-center bg-transparent group-hover:border-[#00a896] group-hover:bg-[#00a896]/5 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 group-hover:text-[#00a896] transition-colors"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <span className="text-[10px] font-bold text-zinc-500">New</span>
              </div>
              
              {/* Existing FlashBacks */}
              {FLASHBACKS.map(fb => (
                <div key={fb.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#00a896] to-[#FFC82A] group-hover:scale-105 transition-transform duration-300 shadow-sm">
                    <div className="w-full h-full rounded-full border-[2.5px] border-white overflow-hidden bg-white">
                      <img src={fb.img} alt={fb.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 w-full text-center truncate">{fb.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="order-2 lg:order-3 lg:col-span-2 w-full px-4 lg:px-8 pt-4 lg:pt-0 border-r border-transparent lg:border-zinc-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-start gap-6 lg:gap-10 pb-6 border-b border-zinc-100 relative z-10">
            {/* Avatar and Stats */}
            <div className="flex flex-col items-start shrink-0">
              {/* Avatar */}
              <div className="relative -mt-12 lg:-mt-16 z-20 shrink-0 cursor-pointer group" onClick={() => setEditOpen(true)}>
                <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-gradient-to-br ${gr} text-white font-black text-5xl flex items-center justify-center ring-[6px] ring-background shadow-xl group-hover:opacity-90 transition-opacity`}>
                  {profile.profilePictureBase64
                    ? <img src={`data:image/jpeg;base64,${profile.profilePictureBase64}`} className="w-full h-full object-cover" alt="" />
                    : <span>{initials}</span>}
                </div>
                {/* Edit Profile */}
                <button onClick={(e) => { e.stopPropagation(); setEditOpen(true); }} className="absolute bottom-1 right-1 w-9 h-9 bg-[#FFC82A] text-zinc-900 rounded-full flex items-center justify-center border-4 border-background shadow-md hover:scale-105 transition-transform">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
              
              {/* Stats Under Profile Picture */}
              <div className="flex items-center gap-3 mt-2 w-full">
                <button onClick={() => setFollowModal({ open: true, mode: "following" })} className="flex flex-col group items-start">
                  <span className="text-lg font-black text-zinc-900 group-hover:text-[#FFC82A] transition-colors">{fmtNum(followingCount)}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Following</span>
                </button>
                <button onClick={() => setFollowModal({ open: true, mode: "followers" })} className="flex flex-col group items-start">
                  <span className="text-lg font-black text-zinc-900 group-hover:text-[#FFC82A] transition-colors">{fmtNum(followerCount)}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Followers</span>
                </button>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-black text-zinc-900">{fmtNum(postCount)}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Posts</span>
                </div>
              </div>
            </div>

            {/* User Bio */}
            <div className="flex-1 min-w-0 pb-2 pt-2 sm:pt-0 ml-4 sm:ml-8 lg:ml-10">
               <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-zinc-900 tracking-tight mt-2">{profile.name}</h1>
                  <p className="text-sm text-zinc-500 font-semibold mb-3">{profile.email}</p>
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      profile.role === "ORGANIZATION" ? "bg-amber-100 text-amber-700" :
                      profile.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-600"
                    }`}>
                      {profile.role || "User"}
                    </span>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 flex items-center gap-1 transition-colors cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      {(profile as any).website || "resulthub.com"}
                    </a>
                  </div>
                  {profile.bio && (
                    <div className="mb-0 relative group z-30">
                      <div className={bioExpanded ? "absolute -top-3 -left-3 -right-3 bg-white p-3 shadow-xl rounded-xl border border-zinc-100" : ""}>
                        <p className={`text-sm text-zinc-700 font-medium leading-relaxed ${bioExpanded ? "line-clamp-4" : "line-clamp-2"}`}>
                          {profile.bio}
                        </p>
                        {!bioExpanded && profile.bio.length > 50 && (
                          <button onClick={() => setBioExpanded(true)} className="text-[11px] font-bold text-[#FFC82A] -mt-1 hover:underline">... more</button>
                        )}
                        {bioExpanded && (
                          <button onClick={() => setBioExpanded(false)} className="text-[11px] font-bold text-zinc-400 mt-2 hover:underline block">Show less</button>
                        )}
                      </div>
                      {/* Placeholder to keep layout stable when absolute */}
                      {bioExpanded && (
                        <div className="opacity-0 pointer-events-none">
                          <p className={`text-sm font-medium leading-relaxed ${bioExpanded ? "line-clamp-4" : "line-clamp-2"}`}>{profile.bio}</p>
                          <div className="text-[11px] mt-1">... more</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Who to Follow */}
        <div className="order-4 lg:order-4 lg:col-span-1 flex flex-col pt-0 lg:pt-0 lg:-mt-12 lg:min-h-full border-l border-transparent lg:border-zinc-100">
          <div className="bg-white overflow-hidden shrink-0 rounded-none lg:rounded-2xl shadow-none lg:shadow-sm border-b lg:border border-zinc-100">
             <div className="px-4 lg:px-3 py-3 border-b border-zinc-100 flex items-center gap-3 shrink-0">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-amber-300 flex items-center justify-center text-white shadow-inner shrink-0">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
               </div>
               <div>
                 <h4 className="text-sm font-black text-zinc-900 leading-tight">Who to Follow</h4>
                 <p className="text-[11px] text-zinc-400 font-semibold">Suggested publishers</p>
               </div>
             </div>

             <div ref={followScrollRef} className="flex flex-col h-[140px] overflow-y-auto">
               {[
                 { name: "ABC College", handle: "abc-college", init: "AC", bg: "bg-[#8A2BE2]", border: "border-[#FFC82A]" },
                 { name: "ResultHub Workspace", handle: "resulthub-workspace", init: "RW", bg: "bg-[#00A896]", border: "border-[#FF7F50]" },
                 { name: "ESPN Sports", handle: "espn-sports", init: "ES", bg: "bg-red-500", border: "border-white" },
                 { name: "Tech Daily", handle: "tech-daily", init: "TD", bg: "bg-blue-600", border: "border-white" },
                 { name: "Finance Updates", handle: "finance-news", init: "FU", bg: "bg-emerald-600", border: "border-white" },
                 { name: "World Politics", handle: "politics-now", init: "WP", bg: "bg-slate-700", border: "border-white" },
                 { name: "Global Weather", handle: "weather-central", init: "GW", bg: "bg-cyan-500", border: "border-white" },
               ].map((s, i) => (
                 <div key={i} className="flex items-center justify-between px-4 lg:px-2.5 py-2.5 border-b border-zinc-50 hover:bg-zinc-50 transition-colors shrink-0">
                   <div className="flex items-center gap-3 min-w-0">
                     <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-white font-black text-sm ring-2 ring-white border-[2px] ${s.border} ${s.bg} shrink-0`}>
                       {s.init}
                     </div>
                     <div className="min-w-0 flex-1">
                       <h5 className="text-sm font-bold text-zinc-900 truncate">{s.name}</h5>
                       <p className="text-xs text-zinc-400 truncate">@{s.handle}</p>
                     </div>
                   </div>
                   <button className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-full hover:bg-zinc-800 transition-colors shrink-0 ml-3">
                     Follow
                   </button>
                 </div>
               ))}
             </div>

             <button onClick={() => followScrollRef.current?.scrollBy({ top: 140, behavior: 'smooth' })} className="w-full p-2 flex items-center justify-center gap-1 text-xs font-black text-[#FFC82A] hover:bg-zinc-50 transition-colors shrink-0">
               More Follow... 
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
             </button>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════
          BODY GRID (Vertical Tabs + Content)
          ══════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4 pt-0 pb-8 items-start">

        {/* ── TABS PANEL ───────────── */}
        <div className={`w-full lg:w-20 shrink-0 sticky z-40 flex flex-row lg:flex-col justify-around lg:justify-start gap-2 overflow-x-auto hide-scrollbar py-2 lg:py-0 bg-background/80 backdrop-blur-md transition-all duration-300 lg:-ml-4 ${showTabs ? 'top-[70px] translate-y-0 opacity-100' : 'top-0 -translate-y-[150%] opacity-0'}`}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              title={t.label}
              className={`flex items-center justify-center p-3 lg:p-4 rounded-xl transition-all shrink-0 ${tab === t.key ? 'bg-transparent text-black' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'}`}
            >
              {t.icon}
            </button>
          ))}
        </div>

        {/* ── RIGHT PANEL (Content Grid) ───────────── */}
        <div className="flex-1 w-full min-w-0">
          <div key={tab} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {tab === "posts" && (
              <div className="grid grid-cols-3 gap-[1px]">
                {[
                  { id: 1, type: "image", img: "https://loremflickr.com/400/400/sports?1" },
                  { id: 2, type: "video", img: "https://loremflickr.com/400/400/fitness?2" },
                  { id: 3, type: "text", text: "New prediction for the upcoming season! 🏀📈", bg: "bg-gradient-to-br from-zinc-800 to-black text-white" },
                  { id: 4, type: "video", img: "https://loremflickr.com/400/400/tennis?4" },
                  { id: 5, type: "image", img: "https://loremflickr.com/400/400/soccer?5" },
                  { id: 6, type: "text", text: "Massive upset expected this weekend. Stay tuned.", bg: "bg-gradient-to-br from-[#00a896] to-[#028090] text-white" },
                  { id: 7, type: "image", img: "https://loremflickr.com/400/400/football?7" },
                  { id: 8, type: "text", text: "Who's ready for the finals? Let's go! 🔥", bg: "bg-gradient-to-br from-[#FFC82A] to-amber-500 text-zinc-900" },
                  { id: 9, type: "video", img: "https://loremflickr.com/400/400/basketball?9" },
                ].map((post) => (
                  <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden rounded-none shadow-none bg-zinc-100 flex items-center justify-center">
                    {post.type !== "text" ? (
                      <img src={post.img} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className={`w-full h-full p-2 sm:p-4 lg:p-6 flex items-center justify-center text-center ${post.bg}`}>
                        <span className="font-bold text-[9px] sm:text-sm lg:text-base leading-tight line-clamp-4">{post.text}</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Top Right Icon Indicator */}
                    <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 drop-shadow-md z-10">
                      {post.type === "image" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="sm:w-5 sm:h-5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="white"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      )}
                      {post.type === "video" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" className="sm:w-5 sm:h-5">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      )}
                      {post.type === "text" && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={post.id === 8 ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)"} strokeWidth="2.5" className="sm:w-5 sm:h-5">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {tab === "clips" && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-[9/16] bg-zinc-900 rounded-2xl relative overflow-hidden group cursor-pointer shadow-sm">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                       <div className="absolute bottom-4 left-4 z-20">
                         <div className="text-white font-black text-sm mb-1">{1.2 + i * 0.3}M Views</div>
                         <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider">Highlight</div>
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            )}

            {tab === "saved" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex gap-4 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm cursor-pointer hover:border-zinc-300 transition-colors">
                       <div className="w-20 h-20 bg-zinc-100 rounded-xl shrink-0 border border-zinc-200/50"></div>
                       <div className="flex flex-col justify-center">
                          <h4 className="font-bold text-sm text-zinc-900 mb-1 leading-tight">Top 10 Trading Strategies</h4>
                          <p className="text-[11px] text-zinc-500 font-semibold line-clamp-2">A deep dive into how top performers maximize their returns consistently without risking their core capital.</p>
                       </div>
                    </div>
                 ))}
              </div>
            )}

            {tab === "tagged" && (
               <div className="grid grid-cols-3 gap-2 lg:gap-4">
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                    <div key={i} className="aspect-square bg-zinc-100 rounded-xl overflow-hidden hover:opacity-80 transition-opacity cursor-pointer border border-zinc-200/50 relative group">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </div>
                    </div>
                 ))}
               </div>
            )}

            {tab === "result" && (
              <div className="space-y-4">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center font-black text-xl border border-emerald-100 shrink-0">W</div>
                          <div>
                             <h4 className="font-bold text-zinc-900 text-sm mb-1">Prediction Won</h4>
                             <p className="text-[11px] text-zinc-500 font-semibold">Lakers vs Warriors (Over 220.5) • {i} days ago</p>
                          </div>
                       </div>
                       <span className="font-black text-emerald-500 text-lg bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">+{450 * i}</span>
                    </div>
                 ))}
              </div>
            )}

            {tab === "complaint" && (
              <div className="space-y-4">
                 {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm flex items-start gap-4 hover:border-red-300 transition-colors">
                       <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0 border border-red-100">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-zinc-900 text-sm">Feedback Ticket #{1024 + i}</h4>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-full tracking-wider">Pending</span>
                          </div>
                          <p className="text-xs text-zinc-500 font-medium leading-relaxed">User reported a minor discrepancy in the final odds calculation on the recent match view. We are investigating.</p>
                       </div>
                    </div>
                 ))}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Edit Drawer */}
      {profile && (
        <EditProfileDrawer
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          profile={profile}
          onSaved={p => setProfile(p)}
        />
      )}

      {/* Followers Modal */}
      {profile && (
        <FollowersModal
          isOpen={followModal.open}
          onClose={() => setFollowModal(p => ({ ...p, open: false }))}
          userId={profile.id}
          mode={followModal.mode}
          title={followModal.mode === "followers" ? `Followers (${fmtNum(followerCount)})` : `Following (${fmtNum(followingCount)})`}
        />
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
      />
    </div>
  );
}

