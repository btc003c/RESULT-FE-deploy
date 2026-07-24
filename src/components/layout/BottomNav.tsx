"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

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
    { label: "Complaint", href: "/complaints", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg> },
    { label: "Clips", href: "/clips", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path><line x1="2" y1="9" x2="22" y2="9"></line><line x1="6" y1="3" x2="6" y2="9"></line><line x1="10" y1="3" x2="10" y2="9"></line><line x1="14" y1="3" x2="14" y2="9"></line><line x1="18" y1="3" x2="18" y2="9"></line></svg> },
    { label: "Chats", href: "/chats", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg> },
    { label: "Profile", href: "/profile", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-muted pb-safe z-40 md:hidden h-12 flex items-center justify-between px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link key={item.label} href={item.href} className={`flex flex-col items-center justify-center w-full space-y-1 transition-colors ${isActive ? "text-black" : "text-zinc-400 hover:text-zinc-600"}`}>
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
}
