"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell } from "lucide-react";
import { AtomLogo } from "@/components/ui/Logos";
import CreatePostModal from "@/components/feed/CreatePostModal";

export default function MobileTopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/clips")) return null;

  const navLinks: any[] = [
    { label: "Home", href: "/", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
    { label: "Result Hub", href: "/results", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M3 15h6" /><path d="M3 18h6" /></svg> },
    { label: "Complaint", href: "/complaints", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg> },
    { label: "Clips", href: "/clips", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path><line x1="2" y1="9" x2="22" y2="9"></line><line x1="6" y1="3" x2="6" y2="9"></line><line x1="10" y1="3" x2="10" y2="9"></line><line x1="14" y1="3" x2="14" y2="9"></line><line x1="18" y1="3" x2="18" y2="9"></line></svg> },
    { label: "Chats", href: "/chats", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg> },
    { label: "Search", href: "/search", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> },
    { label: "Notification", href: "/notifications", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg> },
    { label: "Bookmarks", href: "/bookmarks", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg> },
  ];

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-muted h-12 flex items-center justify-between pl-2 pr-4 w-full relative">

        {/* Left Side: Logo and Create Post */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            <div className="w-8 h-8 shrink-0 bg-[#ffc82a1a] rounded-lg flex items-center justify-center p-0.5">
              <img src="/brand-logo-clear.png" alt="BindTime Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              BindTime
            </span>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className={`w-8 h-8 flex items-center justify-center active:scale-95 transition-all ${isPostModalOpen ? 'text-zinc-900 font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        {/* Right Side: Search, Notification, Result Hub */}
        <div className="flex items-center gap-4">
          <Link href="/search" className={`transition-colors ${pathname === '/search' ? 'text-zinc-900 drop-shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </Link>

          <Link href="/notifications" className={`relative transition-colors ${pathname === '/notifications' ? 'text-zinc-900 drop-shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <Bell size={22} strokeWidth={2.5} />
          </Link>

          <Link href="/results" className={`transition-colors ${pathname === '/results' ? 'text-zinc-900 drop-shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M3 15h6" /><path d="M3 18h6" /></svg>
          </Link>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-background border-r border-muted z-50 flex flex-col shadow-2xl"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-muted">
                <span className="text-lg font-extrabold tracking-tight">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-1 text-foreground/70 hover:text-foreground bg-muted/50 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold ${isActive ? "bg-zinc-100 text-zinc-900" : "text-foreground/80 hover:bg-muted"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.icon}
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-muted">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 rounded-xl font-bold text-[#FAFAF7] bg-black shadow-md shadow-black/10 hover:shadow-black/40 transition-all active:scale-95 p-3 w-full"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Sign In</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </>
  );
}

// Force recompile
