"use client";

import { useState, useEffect } from "react";
import NotificationsRightSidebar from "@/components/feed/NotificationsRightSidebar";
import { api } from "@/lib/api";
import { Bell, CheckCheck, Star, MessageSquare, Database, Building2, AlertTriangle, Settings, UserPlus, CheckCircle2, X, Sliders, ShieldAlert, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings State (Mock)
  const [settings, setSettings] = useState({
    qualityFilter: true,
    pushMentions: true,
    pushLikes: false,
    pushFollows: true,
    hubResults: true,
    hubInvites: true,
    hubDatasets: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    const PREMIUM_MOCK_DATA = [
      { id: 1, type: "LIKE", user: "Sarah Jenkins", avatar: "https://i.pravatar.cc/150?u=sarah", message: "liked your post 'Welcome to BindTime!'", createdAt: new Date().toISOString(), read: false, domain: "Social" },
      { id: 2, type: "MENTION", user: "Tech Campus", avatar: "https://i.pravatar.cc/150?u=tech", message: "mentioned you in a comment.", createdAt: new Date(Date.now() - 3600000).toISOString(), read: false, domain: "Social" },
      { id: 3, type: "WORKSPACE", user: "Ministry of Education", avatar: "MOE", message: "invited you to join their official workspace.", createdAt: new Date(Date.now() - 7200000).toISOString(), read: true, domain: "Hub", official: true },
      { id: 4, type: "DATASET", user: "Gov Analytics", avatar: "GA", message: "published a new dataset 'Q3 Employment Metrics'.", createdAt: new Date(Date.now() - 86400000).toISOString(), read: false, domain: "Hub", official: true },
      { id: 5, type: "COMPLAINT", user: "Campus Network", avatar: "CN", message: "updated your complaint status to RESOLVED.", createdAt: new Date(Date.now() - 172800000).toISOString(), read: true, domain: "Hub", official: true },
      { id: 6, type: "FOLLOW", user: "Alex Chen", avatar: "https://i.pravatar.cc/150?u=alex", message: "started following you.", createdAt: new Date(Date.now() - 200000000).toISOString(), read: true, domain: "Social" },
    ];

    try {
      const res = await api.notifications.get().catch(() => []);
      const rawData = (res.content?.length > 0) ? res.content : PREMIUM_MOCK_DATA;
      setNotifications(rawData);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications(PREMIUM_MOCK_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  // Show all notifications together
  const filteredNotifs = notifications;

  const getIconForType = (type: string, domain: string) => {
    switch (type) {
      case 'LIKE': return <Star className="w-5 h-5 fill-primary text-primary" />;
      case 'MENTION': return <MessageSquare className="w-5 h-5 fill-primary text-primary" />;
      case 'FOLLOW': return <UserPlus className="w-5 h-5 text-primary" />;
      case 'WORKSPACE': return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'DATASET': return <Database className="w-5 h-5 text-blue-500" />;
      case 'COMPLAINT': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Bell className={`w-5 h-5 ${domain === 'Hub' ? 'text-blue-500' : 'text-primary'}`} />;
    }
  };

  const getTimeGroup = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffDays = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return "Earlier";
  };

  // Group notifications by time
  const groupedNotifs = filteredNotifs.reduce((acc, notif) => {
    const group = getTimeGroup(notif.createdAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {} as Record<string, any[]>);

  const timeOrder = ["Today", "Yesterday", "Earlier"];

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}
    >
      <motion.div 
        layout 
        className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" 
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );

  return (
    <div className="flex justify-center w-full min-h-screen bg-background font-sans relative">
      
      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-background border border-muted rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-muted bg-muted/10">
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <Settings size={18} className="text-primary" /> Notification Settings
                </h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-background border border-muted rounded-full hover:bg-muted transition-colors">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-5 overflow-y-auto hide-scrollbar flex flex-col gap-6">
                
                {/* General Section */}
                <div>
                  <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Sliders size={12} /> General
                  </h3>
                  <div className="bg-muted/10 rounded-2xl border border-muted divide-y divide-muted overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Quality Filter</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Filter out low-quality or automated notifications.</p>
                      </div>
                      <ToggleSwitch checked={settings.qualityFilter} onChange={() => toggleSetting('qualityFilter')} />
                    </div>
                  </div>
                </div>

                {/* Social Section */}
                <div>
                  <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Star size={12} className="text-primary" /> Social Media
                  </h3>
                  <div className="bg-muted/10 rounded-2xl border border-muted divide-y divide-muted overflow-hidden">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <span className="text-[13px] font-bold text-foreground">Mentions & Replies</span>
                      <ToggleSwitch checked={settings.pushMentions} onChange={() => toggleSetting('pushMentions')} />
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <span className="text-[13px] font-bold text-foreground">Likes</span>
                      <ToggleSwitch checked={settings.pushLikes} onChange={() => toggleSetting('pushLikes')} />
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <span className="text-[13px] font-bold text-foreground">New Followers</span>
                      <ToggleSwitch checked={settings.pushFollows} onChange={() => toggleSetting('pushFollows')} />
                    </div>
                  </div>
                </div>

                {/* Result Hub Section */}
                <div>
                  <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Building2 size={12} /> Result Hub Alerts
                  </h3>
                  <div className="bg-blue-500/5 rounded-2xl border border-blue-500/20 divide-y divide-blue-500/10 overflow-hidden">
                    <div className="flex items-center justify-between p-4 hover:bg-blue-500/10 transition-colors">
                      <span className="text-[13px] font-bold text-foreground">Official Results Released</span>
                      <ToggleSwitch checked={settings.hubResults} onChange={() => toggleSetting('hubResults')} />
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-blue-500/10 transition-colors">
                      <span className="text-[13px] font-bold text-foreground">Workspace Invitations</span>
                      <ToggleSwitch checked={settings.hubInvites} onChange={() => toggleSetting('hubInvites')} />
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-blue-500/10 transition-colors">
                      <span className="text-[13px] font-bold text-foreground">New Dataset Uploads</span>
                      <ToggleSwitch checked={settings.hubDatasets} onChange={() => toggleSetting('hubDatasets')} />
                    </div>
                  </div>
                </div>

                {/* Advanced Section */}
                <div>
                  <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <ShieldAlert size={12} /> Advanced
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                     <button className="flex items-center justify-center gap-2 p-3 bg-muted/20 border border-muted rounded-xl hover:bg-muted transition-colors text-[12px] font-bold text-foreground">
                       <VolumeX size={14} className="text-muted-foreground" /> Muted Words
                     </button>
                     <button className="flex items-center justify-center gap-2 p-3 bg-muted/20 border border-muted rounded-xl hover:bg-muted transition-colors text-[12px] font-bold text-foreground">
                       <UserPlus size={14} className="text-muted-foreground" /> Blocked Accounts
                     </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN FEED COLUMN */}
      <div className="w-full max-w-[600px] border-x border-muted min-h-screen pb-20">
        
        {/* STICKY HEADER */}
        <div className="sticky top-12 md:top-0 z-30 bg-background/80 backdrop-blur-md border-b border-muted">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
            {/* Settings Icon Removed */}
          </div>
        </div>

        {/* FEED CONTENT */}
        <div className="w-full flex flex-col">
          {isLoading ? (
            <div className="flex justify-center py-10">
               <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                 <Bell size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">Nothing to see here — yet</h3>
              <p className="text-[15px] text-muted-foreground max-w-sm">
                When someone interacts with you or there are official updates from the Result Hub, you'll find them here.
              </p>
            </div>
          ) : (
            timeOrder.map(timeGroup => {
              const groupItems = groupedNotifs[timeGroup];
              if (!groupItems || groupItems.length === 0) return null;

              return (
                <div key={timeGroup}>
                  {/* Time Group Header */}
                  <div className="px-4 py-2 bg-muted/30 border-y border-muted text-xs font-black text-muted-foreground uppercase tracking-widest sticky top-[100px] md:top-[52px] z-20 backdrop-blur-md">
                    {timeGroup}
                  </div>
                  
                  <AnimatePresence>
                    {groupItems.map((notif: any) => (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={notif.id}
                        className={`flex gap-4 p-4 border-b border-muted transition-colors cursor-pointer relative overflow-hidden group 
                          ${notif.read ? 'hover:bg-muted/30' : (notif.domain === 'Hub' ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'bg-primary/5 hover:bg-primary/10')}
                        `}
                      >
                        {/* Highlight Bar for Hub Notifications */}
                        {notif.domain === 'Hub' && (
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${notif.read ? 'bg-blue-500/20' : 'bg-blue-500'}`} />
                        )}
                        
                        {/* Left Column (Icon) */}
                        <div className="flex flex-col items-end pt-1 w-8 shrink-0 relative z-10">
                          {getIconForType(notif.type, notif.domain)}
                        </div>
                        
                        {/* Right Column (Content) */}
                        <div className="flex-1 min-w-0 relative z-10">
                          
                          {/* Avatar Display Logic */}
                          <div className="mb-2 flex items-center justify-between w-full pr-2">
                            {notif.domain === 'Social' ? (
                              <div className="flex items-center gap-2">
                                {/* Social: Circle Avatar */}
                                {notif.avatar && notif.avatar.startsWith('http') ? (
                                  <img src={notif.avatar} alt={notif.user} className="w-9 h-9 rounded-full object-cover border border-muted shadow-sm" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
                                    {notif.avatar || notif.user[0]}
                                  </div>
                                )}
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                  Social Media
                                </span>
                              </div>
                            ) : (
                              // Hub: Square Official Logo
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 rounded-lg bg-background border border-muted flex items-center justify-center text-blue-600 font-black text-xs shadow-sm overflow-hidden relative">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-blue-500/20"></div>
                                    {notif.avatar || notif.user.substring(0,2)}
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] w-fit font-bold uppercase tracking-wider text-white bg-blue-600 px-2 py-0.5 rounded-full shadow-sm">
                                      Result Hub
                                    </span>
                                    {notif.official && (
                                      <span className="text-[10px] w-fit font-black uppercase tracking-wider text-blue-600 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Official Update
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <p className={`text-[15px] leading-snug ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                            <span className={`font-bold hover:underline ${!notif.read && 'text-foreground'}`}>{notif.user}</span> {notif.message}
                          </p>
                          
                        </div>
                        
                        {/* Unread Indicator */}
                        {!notif.read && (
                          <div className="shrink-0 pt-2 relative z-10">
                            <div className={`w-2.5 h-2.5 rounded-full ${notif.domain === 'Hub' ? 'bg-blue-500' : 'bg-primary'}`} />
                          </div>
                        )}
                        
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* RIGHT SIDEBAR (Desktop) */}
      <div className="hidden lg:block w-[350px] pl-8 pt-2">
         <NotificationsRightSidebar />
      </div>

    </div>
  );
}
