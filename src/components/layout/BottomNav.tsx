"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreatePostModal from "@/components/feed/CreatePostModal";

export default function BottomNav() {
  const pathname = usePathname();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Hide BottomNav on dashboard, admin, and login/signup routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup")
  ) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { label: "Chats", href: "/chats", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg> },
    { label: "Search", href: "/search", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> },
    { label: "Profile", href: "/profile", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-muted pb-safe z-40 md:hidden h-16 flex items-center justify-between px-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center justify-center w-full space-y-1 transition-colors ${isActive ? "text-black" : "text-zinc-400 hover:text-zinc-600"}`}>
              {item.icon}
            </Link>
          );
        })}
        
        {/* Floating Action Button (FAB) */}
        <div className="relative w-full flex justify-center items-center">
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center justify-center w-full space-y-1 transition-colors ${isActive ? "text-black" : "text-zinc-400 hover:text-zinc-600"}`}>
              {item.icon}
            </Link>
          );
        })}
      </div>

      <CreatePostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </>
  );
}
