"use client";

import Link from "next/link";
import { Building2, CheckCircle2, TrendingUp, Users } from "lucide-react";

export default function NotificationsRightSidebar({ className = "" }: { className?: string }) {

  return (
    <aside className={`flex flex-col gap-6 w-full pb-6 pt-5 sticky top-0 ${className}`}>
      
      {/* SaaS Unified Dashboard Widget (Simplified for Notifications) */}
      <div className="bg-background rounded-2xl border border-muted shadow-sm overflow-hidden flex flex-col">
        
        {/* Section 1: Today's Activity Summary */}
        <div className="p-4 border-b border-muted">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" />
            Your Impact Today
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 p-3 rounded-xl border border-muted/50 flex flex-col items-start hover:bg-muted/50 transition-colors cursor-pointer">
              <span className="text-[11px] font-bold text-muted-foreground">Profile Views</span>
              <span className="text-lg font-black text-foreground">124</span>
            </div>
            <div className="bg-muted/30 p-3 rounded-xl border border-muted/50 flex flex-col items-start hover:bg-muted/50 transition-colors cursor-pointer">
              <span className="text-[11px] font-bold text-muted-foreground">New Followers</span>
              <span className="text-lg font-black text-foreground">+12</span>
            </div>
          </div>
        </div>

        {/* Section 2: Trending Hub Alerts */}
        <div className="p-4 border-b border-muted bg-gradient-to-br from-blue-500/5 to-background">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Building2 size={14} className="text-blue-500" />
              Trending Hub Alerts
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="group cursor-pointer">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-muted-foreground">Government • Education</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                <span className="text-[10px] font-bold text-blue-500">Official</span>
              </div>
              <h4 className="text-[13px] font-bold text-foreground group-hover:text-blue-600 transition-colors leading-snug">
                TNPSC Group 4 Results Final List Released
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium mt-1">45.2K discussing this</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-muted-foreground">Technology • Enterprise</span>
              </div>
              <h4 className="text-[13px] font-bold text-foreground group-hover:text-blue-600 transition-colors leading-snug">
                Q3 Software Developer Salary Benchmarks Dataset
              </h4>
              <p className="text-[11px] text-muted-foreground font-medium mt-1">12K discussing this</p>
            </div>
          </div>
        </div>

        {/* Section 3: Suggested Organizations */}
        <div className="p-4 bg-muted/10">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={14} className="text-primary" />
            Who to follow (Hub)
          </h3>
          <div className="space-y-4">
            {[
              { name: "Ministry of Education", handle: "@moe_gov", avatar: "M", verified: true },
              { name: "TechCorp Global", handle: "@techcorpglobal", avatar: "T", verified: false },
              { name: "State Analytics Board", handle: "@state_analytics", avatar: "S", verified: true },
            ].map((org, i) => (
              <div key={i} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-background border border-muted shadow-sm flex items-center justify-center text-foreground font-black text-xs shrink-0 relative overflow-hidden group-hover:border-primary/50 transition-colors">
                     <div className="absolute inset-x-0 top-0 h-1 bg-primary/20"></div>
                     {org.avatar}
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <h4 className="text-[13px] font-bold text-foreground truncate flex items-center gap-1 hover:underline cursor-pointer">
                      {org.name}
                      {org.verified && <CheckCircle2 size={12} className="text-blue-500 fill-blue-500/10" />}
                    </h4>
                    <p className="text-[11px] font-medium text-muted-foreground truncate">{org.handle}</p>
                  </div>
                </div>
                <button className="shrink-0 px-4 py-1.5 bg-foreground text-background text-[11px] font-bold rounded-full hover:bg-foreground/90 transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-4 text-[12px] font-medium text-muted-foreground">
         <Link href="/terms" className="hover:underline hover:text-foreground transition-colors">Terms of Service</Link>
         <Link href="/privacy" className="hover:underline hover:text-foreground transition-colors">Privacy Policy</Link>
         <Link href="/cookie" className="hover:underline hover:text-foreground transition-colors">Cookie Policy</Link>
         <Link href="/accessibility" className="hover:underline hover:text-foreground transition-colors">Accessibility</Link>
         <span>© 2026 BindTime Corp.</span>
      </div>

    </aside>
  );
}
