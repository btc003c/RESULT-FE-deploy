"use client";

import { useState } from "react";

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

export default function ChatsPage() {
  const [activeContactId, setActiveContactId] = useState(MOCK_CONTACTS[1].id);
  const [messageInput, setMessageInput] = useState("");
  
  const activeContact = MOCK_CONTACTS.find(c => c.id === activeContactId) || MOCK_CONTACTS[0];

  return (
    <div className="flex-1 w-full h-[calc(100vh-80px)] md:h-screen flex bg-zinc-50/50 animate-in fade-in duration-300">
      
      {/* Left Sidebar (Contacts list) */}
      <div className="w-full md:w-[350px] border-r border-zinc-200 bg-white flex flex-col h-full shrink-0">
         
         {/* Header & Search */}
         <div className="p-4 border-b border-zinc-100">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Messages</h2>
             <button className="p-2 text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
             </button>
           </div>
           
           <div className="relative">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             <input 
               type="text" 
               placeholder="Search messages..." 
               className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium placeholder:text-muted-foreground"
             />
           </div>
         </div>

         {/* Contacts List */}
         <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
           {MOCK_CONTACTS.map(contact => (
             <div 
               key={contact.id} 
               onClick={() => setActiveContactId(contact.id)}
               className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1
                 ${activeContactId === contact.id ? 'bg-primary/5 shadow-sm border border-primary/10' : 'hover:bg-zinc-100 border border-transparent'}`}
             >
               <div className="relative shrink-0">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white
                   ${contact.id === 'c1' ? 'bg-indigo-500' : contact.id === 'c3' ? 'bg-emerald-500' : 'bg-primary'}`}>
                   {contact.avatar}
                 </div>
                 {contact.unread > 0 && (
                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                     {contact.unread}
                   </span>
                 )}
               </div>
               
               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between mb-0.5">
                   <h3 className="font-bold text-foreground truncate pr-2 text-sm md:text-base">{contact.name}</h3>
                   <span className={`text-xs whitespace-nowrap ${contact.unread > 0 ? 'text-primary font-bold' : 'text-muted-foreground font-medium'}`}>{contact.time}</span>
                 </div>
                 <p className={`text-sm truncate ${contact.unread > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                   {contact.lastMessage}
                 </p>
               </div>
             </div>
           ))}
         </div>
      </div>

      {/* Right Pane (Chat Window) */}
      {/* Hidden on mobile if not active, but since this is a mockup we'll show it side by side on md+ and stack or hide on mobile (simplified here to always show for structural demo) */}
      <div className="flex-1 hidden md:flex flex-col h-full bg-[url('/chat-pattern.png')] bg-repeat bg-[length:400px_400px] bg-white">
         
         {/* Chat Header */}
         <div className="p-4 border-b border-zinc-100 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
               {activeContact.avatar}
             </div>
             <div>
               <h3 className="font-bold text-foreground leading-tight">{activeContact.name}</h3>
               <span className="text-xs text-muted-foreground font-medium">{activeContact.handle}</span>
             </div>
           </div>
           
           <div className="flex items-center gap-2">
             <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             </button>
             <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
             </button>
             <button className="p-2.5 text-muted-foreground hover:bg-zinc-100 rounded-full transition-colors ml-2">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
             </button>
           </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-zinc-50/30">
           
           <div className="flex justify-center mb-6">
             <span className="px-3 py-1 bg-zinc-200/50 text-zinc-500 text-xs font-bold rounded-full">Today</span>
           </div>

           {MOCK_MESSAGES.map((msg) => (
             <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group`}>
               <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm relative ${
                 msg.isMe 
                  ? 'bg-primary text-white rounded-tr-sm' 
                  : 'bg-white border border-zinc-100 text-foreground rounded-tl-sm'
               }`}>
                 <p className="text-sm md:text-base font-medium leading-relaxed">{msg.text}</p>
                 <div className={`text-[10px] font-bold mt-1.5 flex items-center justify-end gap-1 ${msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                   {msg.time}
                   {msg.isMe && (
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   )}
                 </div>
               </div>
             </div>
           ))}
         </div>

         {/* Message Input Area */}
         <div className="p-4 bg-white border-t border-zinc-100 shrink-0">
           <div className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
             <button className="p-2.5 text-muted-foreground hover:bg-zinc-200 rounded-xl transition-colors shrink-0">
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             </button>
             <textarea 
               rows={1}
               value={messageInput}
               onChange={(e) => setMessageInput(e.target.value)}
               placeholder="Type a message..." 
               className="w-full bg-transparent border-none outline-none resize-none text-foreground text-sm font-medium py-3 max-h-[120px] hide-scrollbar"
             />
             {messageInput.trim() ? (
               <button className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shrink-0 mb-0.5 mr-0.5 active:scale-95">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
               </button>
             ) : (
               <button className="p-2.5 text-muted-foreground hover:bg-zinc-200 rounded-xl transition-colors shrink-0 mb-0.5 mr-0.5">
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
               </button>
             )}
           </div>
         </div>

      </div>
    </div>
  );
}
