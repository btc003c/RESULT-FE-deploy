"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Mock Data
const MOCK_CONTACTS = [
  { id: "c1", name: "Result Hub Support", handle: "@support", lastMessage: "Your ticket has been updated.", time: "10:42 AM", unread: 1, avatar: "R" },
  { id: "c2", name: "Alex Johnson", handle: "@alexj", lastMessage: "Did you see the new feature drop?", time: "Yesterday", unread: 0, avatar: "A" },
  { id: "c3", name: "Marketing Team", handle: "@marketing", lastMessage: "Let's review the campaign metrics.", time: "Tuesday", unread: 3, avatar: "M" },
  { id: "c4", name: "Jane Doe", handle: "@janedoe", lastMessage: "Haha that video was hilarious 😂", time: "Mon", unread: 0, avatar: "J" },
];

const MOCK_MESSAGES = [
  { id: "m1", senderId: "c2", text: "Hey! Are you online?", time: "10:30 AM", isMe: false },
  { id: "m2", senderId: "me", text: "Yeah, just working on the new UI updates. What's up?", time: "10:32 AM", isMe: true },
  { id: "m3", senderId: "c2", text: "Did you see the new feature drop? It looks amazing.", time: "10:33 AM", isMe: false },
];

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of thread
  useEffect(() => {
    if (activeContactId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeContactId]);

  if (!isOpen) return null;

  const activeContact = MOCK_CONTACTS.find(c => c.id === activeContactId);

  return (
    <div className="fixed bottom-4 right-4 w-[320px] h-[420px] bg-white rounded-2xl shadow-2xl border border-zinc-200/60 z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 fade-in zoom-in-95 duration-200">
      
      {/* ── Inbox View ─────────────────────────────────────────────── */}
      {!activeContactId && (
        <>
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-100 bg-white/90 backdrop-blur-sm flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-extrabold text-zinc-900">Messages</h3>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/chats" className="p-2 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Expand to full page">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
              </Link>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-zinc-50 shrink-0">
            <div className="relative">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-100/50 border border-zinc-200/50 rounded-full outline-none focus:ring-2 focus:ring-[#FFC82A]/50 focus:bg-white transition-all text-sm font-medium placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
            {MOCK_CONTACTS.map(contact => (
              <div 
                key={contact.id} 
                onClick={() => setActiveContactId(contact.id)}
                className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-zinc-50 border border-transparent transition-all mb-1 group"
              >
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm transition-transform group-hover:scale-105
                    ${contact.id === 'c1' ? 'bg-gradient-to-br from-indigo-500 to-blue-500' : contact.id === 'c3' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`}>
                    {contact.avatar}
                  </div>
                  {contact.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                      {contact.unread}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-bold text-zinc-900 truncate text-sm">{contact.name}</h4>
                    <span className={`text-[10px] whitespace-nowrap ${contact.unread > 0 ? 'text-[#FFC82A] font-black' : 'text-zinc-400 font-medium'}`}>{contact.time}</span>
                  </div>
                  <p className={`text-[13px] truncate ${contact.unread > 0 ? 'font-bold text-zinc-800' : 'text-zinc-500'}`}>
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Thread View ────────────────────────────────────────────── */}
      {activeContactId && activeContact && (
        <div className="flex flex-col h-full bg-zinc-50/30">
          {/* Header */}
          <div className="px-3 py-3 border-b border-zinc-100 bg-white/95 backdrop-blur-sm flex items-center justify-between shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveContactId(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="flex items-center gap-2.5">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm
                    ${activeContact.id === 'c1' ? 'bg-gradient-to-br from-indigo-500 to-blue-500' : activeContact.id === 'c3' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`}>
                    {activeContact.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-zinc-900 text-sm leading-tight">{activeContact.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-medium">Online</span>
                  </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full uppercase tracking-wider">Today</span>
            </div>
            {MOCK_MESSAGES.map(msg => (
              <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium shadow-sm leading-relaxed
                  ${msg.isMe 
                    ? 'bg-gradient-to-r from-[#FFC82A] to-amber-400 text-amber-950 rounded-tr-sm' 
                    : 'bg-white border border-zinc-100 text-zinc-800 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 font-medium mx-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-100 bg-white shrink-0">
            <div className="flex items-center gap-2 bg-zinc-100/80 p-1.5 rounded-full border border-zinc-200/50 focus-within:ring-2 focus-within:ring-[#FFC82A]/30 focus-within:bg-white transition-all">
               <button className="p-1.5 text-zinc-400 hover:text-primary transition-colors shrink-0">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
               </button>
               <input 
                 type="text" 
                 value={messageInput}
                 onChange={(e) => setMessageInput(e.target.value)}
                 placeholder="Message..." 
                 className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium text-zinc-800 placeholder:text-zinc-400 min-w-0"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && messageInput.trim()) {
                     setMessageInput("");
                   }
                 }}
               />
               <button 
                 disabled={!messageInput.trim()}
                 className={`p-1.5 rounded-full shrink-0 transition-all ${messageInput.trim() ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'text-zinc-300'}`}
               >
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
