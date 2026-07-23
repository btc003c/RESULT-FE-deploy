"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import CreatePostModal from "./CreatePostModal";
import { AtomLogo } from "@/components/ui/Logos";
import { api, clearAuthToken } from "@/lib/api";

// ─── Nav data ────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Main",
    links: [
      {
        label: "Home",
        href: "/",
        exact: true,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      {
        label: "Result Hub",
        href: "/results",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M3 15h6" /><path d="M3 18h6" />
          </svg>
        ),
      },
      {
        label: "Complaint Box",
        href: "/complaints",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
            <path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path>
          </svg>
        ),
      },
      {
        label: "Clips",
        href: "/clips",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path>
            <line x1="2" y1="9" x2="22" y2="9"></line>
            <line x1="6" y1="3" x2="6" y2="9"></line>
            <line x1="10" y1="3" x2="10" y2="9"></line>
            <line x1="14" y1="3" x2="14" y2="9"></line>
            <line x1="18" y1="3" x2="18" y2="9"></line>
          </svg>
        ),
      },
      {
        label: "Chats",
        href: "/chats",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Discover",
    links: [
      {
        label: "Search",
        href: "/search",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        ),
      },
      {
        label: "Notification",
        href: "/notifications",
        badge: "live",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        ),
      },
      {
        label: "Bookmarks",
        href: "/bookmarks",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        ),
      },
      {
        label: "Sign In",
        href: "/login",
        isSignIn: true,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
      {
        label: "Profile",
        href: "/profile",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        ),
      },
    ],
  },
];

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function Tooltip({ label }: { label: string }) {
  return (
    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none
                    bg-zinc-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg
                    whitespace-nowrap shadow-lg opacity-0 group-hover/tip:opacity-100
                    translate-x-1 group-hover/tip:translate-x-0 transition-all duration-150">
      {label}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (manualOverride) return;
      if (window.innerWidth < 1280) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [manualOverride]);
  const [notifCount, setNotifCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") : null;
        if (!token) return;
        const userData = await api.auth.me();
        setUserProfile(userData);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch unread notification count
  useEffect(() => {
    const fetchNotifCount = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") : null;
        if (!token) return;
        const res = await api.notifications.get().catch(() => null);
        if (res) {
          const unread = (res.content || res || []).filter((n: any) => !n.isRead).length;
          setNotifCount(unread);
        }
      } catch (_) { }
    };
    fetchNotifCount();
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <aside
        className={`relative sticky top-0 hidden md:flex flex-col h-screen z-40 transition-all duration-300 shrink-0
          ${isExpanded ? "w-[268px]" : "w-[76px]"}
          bg-[#FFC82A]/10 border-r border-[#FFC82A]/20 shadow-[1px_0_0_0_#f4f4f5]`}
      >
        {/* Extended background for ultra-wide monitors */}
        <div className="absolute top-0 right-full w-[50vw] h-full bg-[#FFC82A]/10 -z-10 hidden xl:block border-r border-transparent" />
        {/* Collapse toggle (Vertically Centered on Sidebar) */}
        <button
          onClick={() => { setIsExpanded(!isExpanded); setManualOverride(true); }}
          className={`absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-zinc-200
            rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900
            hover:border-zinc-400 shadow-sm transition-all duration-200 hover:scale-110 z-50`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            {isExpanded
              ? <polyline points="15 18 9 12 15 6" />
              : <polyline points="9 18 15 12 9 6" />
            }
          </svg>
        </button>

        {/* ── Brand ─────────────────────────────────────────────────── */}
        <div className={`flex items-center h-[72px] shrink-0 border-b border-zinc-100
          ${isExpanded ? "px-5" : "justify-center px-3"}`}>
          <div className="flex items-center gap-0.5 group min-w-0">
            {/* Logo mark */}
            <div className="w-10 h-10 shrink-0 bg-[#ffc82a1a] rounded-xl flex items-center justify-center p-0.5">
              <img src="/brand-logo-clear.png" alt="BindTime Logo" className="w-full h-full object-contain" />
            </div>
            {isExpanded && (
              <div className="overflow-hidden">
                <span className="text-[17px] font-black tracking-tight text-zinc-900 whitespace-nowrap block leading-tight">
                  BindTime
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Create Post CTA ────────────────────────────────────────── */}
        <div className={`px-3 pt-4 pb-2 ${!isExpanded && "flex justify-center"}`}>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className={`relative overflow-hidden font-bold text-[#FAFAF7] rounded-xl
              bg-black
              shadow-lg shadow-black/20
              transition-all duration-200 active:scale-95
              ${isExpanded
                ? "w-full flex items-center gap-3 px-4 py-3"
                : "w-12 h-12 flex items-center justify-center"}`}
            title="Create Post"
          >

            <div className="w-5 h-5 rounded-full border-2 border-white/60 flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            {isExpanded && (
              <span className="text-[14px] tracking-wide whitespace-nowrap">Create Post</span>
            )}
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2">
          {NAV_SECTIONS.map((section, index) => (
            <div key={section.label} className="mb-1">
              {isExpanded && (
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-400 px-3 pt-4 pb-1.5">
                  {section.label}
                </p>
              )}

              {/* Divider between sections (only show if not the first section and ONLY in collapsed mode) */}
              {index > 0 && !isExpanded && (
                <div className="flex justify-center my-3">
                  <div className="h-[2px] bg-zinc-200 rounded-full w-8" />
                </div>
              )}

              {section.links.map((link) => {
                if ((link as any).isSignIn) {
                  if (userProfile) return null;
                  return (
                    <div key="sign-in" className="mt-8 mb-4">
                      <Link
                        href="/login"
                        className={`flex items-center gap-3.5 rounded-xl font-bold text-[#FAFAF7]
                          bg-black shadow-md shadow-black/10
                          hover:shadow-black/40 transition-all active:scale-95 py-2.5
                          ${isExpanded ? "px-3" : "justify-center px-0"}`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                          </svg>
                        </div>
                        {isExpanded && <span className="text-[14.5px] font-bold flex-1">Sign In</span>}
                      </Link>
                    </div>
                  );
                }

                const active = isActive(link.href, (link as any).exact);
                const badgeNum = (link as any).badge === "live" ? notifCount : null;

                return (
                  <div key={link.label} className="relative group/tip">
                    <Link
                      href={link.href}
                      className={`relative flex items-center gap-3.5 rounded-xl transition-all duration-150
                        ${isExpanded ? "px-3 py-2.5" : "justify-center px-0 py-2.5"}
                        ${active
                          ? "bg-transparent text-zinc-950 font-black"
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 font-semibold"
                        }`}
                    >
                      {/* Active left bar (Removed) */}

                      {/* Icon container */}
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-150
                        ${active
                          ? "bg-transparent text-zinc-950"
                          : "text-zinc-400 group-hover:bg-zinc-200/50 group-hover:text-zinc-700"
                        }`}>
                        {link.icon}
                      </div>

                      {/* Label */}
                      {isExpanded && (
                        <span className="text-[14.5px] whitespace-nowrap flex-1">{link.label}</span>
                      )}

                      {/* Badge */}
                      {isExpanded && (link as any).badge && (
                        (link as any).badge === "live" ? (
                          badgeNum && badgeNum > 0 ? (
                            <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-black shadow-sm">
                              {badgeNum > 99 ? "99+" : badgeNum}
                            </span>
                          ) : null
                        ) : (
                          <span className="ml-auto text-[9px] font-black bg-gradient-to-r from-rose-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full tracking-wider shadow-sm">
                            {(link as any).badge}
                          </span>
                        )
                      )}

                      {/* Collapsed badge dot */}
                      {!isExpanded && (link as any).badge === "live" && (badgeNum || 0) > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white animate-pulse" />
                      )}
                    </Link>

                    {/* Tooltip (collapsed mode) */}
                    {!isExpanded && <Tooltip label={link.label} />}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Bottom: Profile / Auth ─────────────────────────────────── */}
        <div className="border-t border-zinc-100 px-3 py-4 shrink-0">
          {userProfile ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-full flex items-center rounded-xl hover:bg-zinc-50 transition-colors p-2 group
                  ${!isExpanded && "justify-center"}`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-[#F97316] to-[#fdba74] text-white flex items-center justify-center font-black text-base shadow-sm">
                    {userProfile.profilePictureBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${userProfile.profilePictureBase64}`}
                        alt={userProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(userProfile.name || "U")[0].toUpperCase()}</span>
                    )}
                  </div>
                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                </div>

                {isExpanded && (
                  <>
                    <div className="flex-1 min-w-0 ml-3 text-left">
                      <p className="text-[13px] font-bold text-zinc-900 truncate leading-tight">
                        {userProfile.name || "User"}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate font-medium">
                        {userProfile.email || ""}
                      </p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      className={`text-zinc-400 ml-1 shrink-0 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </>
                )}
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className={`absolute z-50 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 w-52
                  ${isExpanded ? "bottom-full left-0 mb-2" : "bottom-0 left-full ml-3"}`}>
                  <Link href="/profile" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors text-sm font-semibold text-zinc-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    View Profile
                  </Link>
                  <Link href="/settings" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors text-sm font-semibold text-zinc-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                    Settings
                  </Link>
                  <div className="my-1 mx-3 border-t border-zinc-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm font-semibold text-red-500 text-left"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </aside>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        defaultType="UPDATE"
      />
    </>
  );
}

// Force recompile
