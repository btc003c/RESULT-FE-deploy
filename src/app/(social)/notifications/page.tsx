"use client";

import { useState, useEffect } from "react";
import NotificationsRightSidebar from "@/components/feed/NotificationsRightSidebar";
import { api } from "@/lib/api";
import { Bell, CheckCircle2, Star, MessageSquare, Database, Building2, AlertTriangle, Activity } from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const mockData = [
      { id: 1, type: "LIKE", title: "Sarah Jenkins", message: "liked your post 'Welcome to BindTime!'", createdAt: new Date().toISOString(), read: false },
      { id: 2, type: "MENTION", title: "Tech Campus", message: "mentioned you in a comment.", createdAt: new Date(Date.now() - 3600000).toISOString(), read: false },
      { id: 6, type: "LIKE", title: "Alex Chen", message: "liked your comment on 'Campus Life'", createdAt: new Date(Date.now() - 4200000).toISOString(), read: false },
      { id: 7, type: "MENTION", title: "Maria Garcia", message: "replied to your post.", createdAt: new Date(Date.now() - 5000000).toISOString(), read: true },
      { id: 8, type: "LIKE", title: "David Smith", message: "liked your dataset upload.", createdAt: new Date(Date.now() - 6000000).toISOString(), read: true },
      { id: 3, type: "WORKSPACE", title: "Global Analytics", message: "invited you to join their workspace.", createdAt: new Date(Date.now() - 7200000).toISOString(), read: true },
      { id: 4, type: "DATASET", title: "Q3 Metrics", message: "dataset has been successfully published.", createdAt: new Date(Date.now() - 86400000).toISOString(), read: true },
      { id: 5, type: "COMPLAINT", title: "Campus Network", message: "complaint status updated to RESOLVED.", createdAt: new Date(Date.now() - 172800000).toISOString(), read: true },
    ];

    try {
      const res = await api.notifications.get();
      setNotifications(res.content?.length > 0 ? res.content : mockData);
    } catch (error) {
      console.error("Failed to fetch notifications, falling back to mock data:", error);
      setNotifications(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { name: "Activity", mobileOnly: true },
    { name: "All" },
    { name: "Mentions" },
    { name: "Workspaces" },
    { name: "Data" },
    { name: "Complaints" }
  ];

  // Filtering Logic
  const filteredNotifs = notifications.filter(n => {
    if (activeTab === "All" || activeTab === "Activity") return true;
    if (activeTab === "Mentions" && n.type === "MENTION") return true;
    if (activeTab === "Workspaces" && n.type === "WORKSPACE") return true;
    if (activeTab === "Data" && n.type === "DATASET") return true;
    if (activeTab === "Complaints" && n.type === "COMPLAINT") return true;
    return false;
  });

  const groupNotifications = (notifs: any[]) => {
    if (!notifs || notifs.length === 0) return {};
    
    return notifs.reduce((groups: any, notif: any) => {
      let dateKey = "Earlier";
      if (notif.createdAt) {
        const date = new Date(notif.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 0) dateKey = "Today";
        else if (diffDays === 1) dateKey = "Yesterday";
        else if (diffDays < 7) dateKey = "This Week";
      }

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push({
        id: notif.id,
        type: notif.type,
        user: notif.title,
        text: notif.message,
        timeAgo: notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
        read: notif.read,
      });
      return groups;
    }, {});
  };

  const groupedNotifications = groupNotifications(filteredNotifs);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'LIKE': return <Star className="w-4 h-4 text-pink-500" />;
      case 'MENTION': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'WORKSPACE': return <Building2 className="w-4 h-4 text-emerald-500" />;
      case 'DATASET': return <Database className="w-4 h-4 text-purple-500" />;
      case 'COMPLAINT': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="flex w-full">
      
      {/* Main Notification Feed */}
      <div className="w-full xl:w-[65%] shrink-0 min-w-0 border-x-0 sm:border-x border-zinc-200 min-h-screen bg-white pb-12">
        {/* Header */}
        <div className="bg-white border-b border-zinc-100 pt-5 px-4 sm:px-6 pb-4 sticky top-0 z-20 backdrop-blur-xl bg-white/90">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-zinc-400" />
              Notifications
            </h1>
            <button className="text-[13px] font-bold text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          </div>
          
          {/* Unified AI Smart Summary */}
          <div className="bg-gradient-to-r from-yellow-500/10 via-white to-white rounded-[14px] border border-zinc-200 p-3 mb-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
               <span className="bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider w-fit shrink-0">
                 AI Summary
               </span>
               <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-bold text-zinc-700">
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-pink-500" /> 2 new likes</span>
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-blue-500" /> 1 mention</span>
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-emerald-500" /> 1 workspace invite</span>
               </div>
            </div>
          </div>

          {/* Unified Tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full border-b border-zinc-100 pb-2">
             {tabs.map(tab => (
               <button 
                 key={tab.name}
                 onClick={() => setActiveTab(tab.name)}
                 className={`px-4 py-2 flex items-center gap-1.5 font-bold text-sm transition-all rounded-xl whitespace-nowrap ${tab.mobileOnly ? 'xl:hidden' : ''} ${
                   activeTab === tab.name 
                     ? "bg-zinc-900 text-white shadow-md" 
                     : "text-zinc-600 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200"
                 }`}
               >
                 {tab.name}
               </button>
             ))}
          </div>
        </div>

        {/* Content Rendering */}
        {activeTab === 'Activity' ? (
          <div className="px-4 sm:px-6 xl:hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <NotificationsRightSidebar />
          </div>
        ) : (
          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin text-zinc-400">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              </div>
            ) : filteredNotifs.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-sm border bg-zinc-50 border-zinc-200">
                   <Activity className="w-10 h-10 text-zinc-400" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-2">You're all caught up!</h3>
                <p className="text-sm font-medium text-zinc-500 max-w-sm leading-relaxed">
                  When you receive mentions, workspace invites, or dataset updates, they will appear here.
                </p>
              </div>
            ) : Object.entries(groupedNotifications).map(([timeGroup, notifs]: any) => (
              <div key={timeGroup}>
                <div className="px-6 py-2.5 bg-zinc-50/50 border-b border-zinc-100">
                  <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">{timeGroup}</h3>
                </div>
                
                {notifs.map((notif: any) => {
                  const isSocial = ['LIKE', 'MENTION'].includes(notif.type);
                  
                  return (
                    <div 
                      key={notif.id} 
                      className={`relative p-4 px-6 border-b border-zinc-100 cursor-pointer flex gap-4 transition-all duration-200 group ${notif.read ? 'bg-white hover:bg-zinc-50' : 'bg-zinc-50/50 hover:bg-zinc-50'}`}
                    >
                      {/* Left Color Bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${isSocial ? 'bg-orange-400' : 'bg-indigo-500'}`} />
                      
                      {/* Avatar */}
                      <div className="relative shrink-0 mt-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white shadow-sm transition-transform duration-200 group-hover:scale-105 ${isSocial ? 'bg-gradient-to-br from-orange-400 to-amber-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                          {notif.user[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                          {getIconForType(notif.type)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-base text-zinc-700 leading-tight">
                            <span className="font-black text-zinc-900">{notif.user}</span> {notif.text}
                          </p>
                          {/* Zone Badge */}
                          <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${isSocial ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                            {isSocial ? 'Social' : 'Hub'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-zinc-400 mt-1.5">{notif.timeAgo}</p>
                      </div>

                      {!notif.read && (
                        <div className="shrink-0 flex items-center justify-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${isSocial ? 'bg-orange-500' : 'bg-indigo-500'}`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Right Sidebar */}
      <div className="hidden xl:block w-[35%] border-r border-zinc-200 bg-zinc-50">
        <NotificationsRightSidebar />
      </div>
    </div>
  );
}
