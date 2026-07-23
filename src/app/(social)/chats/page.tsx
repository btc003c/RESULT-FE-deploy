"use client";

import { useState, useRef, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';

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
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  // New Interactive States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [attachments, setAttachments] = useState<{name: string, type: 'image' | 'file'}[]>([]);
  const [activeCall, setActiveCall] = useState<'voice' | 'video' | null>(null);
  const [showTopMenu, setShowTopMenu] = useState(false);
  
  // Sidebar Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const activeContact = MOCK_CONTACTS.find(c => c.id === activeContactId) || MOCK_CONTACTS[0];
  
  // Filter contacts based on search query
  const filteredContacts = MOCK_CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Recording Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newAttachments = files.map(file => {
        const isImage = file.type.startsWith('image/') || file.type.startsWith('video/');
        return { name: file.name, type: isImage ? 'image' as const : 'file' as const };
      });
      setAttachments(prev => [...prev, ...newAttachments]);
      setShowAttachmentMenu(false);
      // Reset input so same files can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() && attachments.length === 0 && !isRecording) return;
    
    // In a real app, this would dispatch to backend
    console.log("Sending:", { text: messageInput, attachments, isAudio: isRecording });
    
    setMessageInput("");
    setAttachments([]);
    setIsRecording(false);
  };

  return (
    <div className="flex-1 w-full h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] md:h-screen flex bg-zinc-50/50 animate-in fade-in duration-300 pb-16 md:pb-0 relative">
      
      {/* Global Click-Away Overlay for Menus */}
      {(showTopMenu || showAttachmentMenu || showEmojiPicker) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowTopMenu(false);
            setShowAttachmentMenu(false);
            setShowEmojiPicker(false);
          }}
        />
      )}

      {/* Premium Calling Overlay Modal */}
      {activeCall && (
        <div className="absolute inset-0 z-[100] bg-zinc-900/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
              <span className="text-4xl font-black text-white">{activeContact.avatar}</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Calling {activeContact.name}...</h2>
            <p className="text-white/60 mb-12">{activeCall === 'video' ? 'Video' : 'Voice'} Call ringing</p>
            
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => setActiveCall(null)}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="22" y1="2" x2="2" y2="22"></line></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="absolute inset-0 z-[110] bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white w-[90%] max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setShowNewChatModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="text-xl font-bold text-foreground mb-4">New Message</h2>
            <div className="relative mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search username or name..." 
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Suggested</p>
              {MOCK_CONTACTS.slice(0, 2).map(contact => (
                <div key={`sug-${contact.id}`} onClick={() => { setActiveContactId(contact.id); setShowNewChatModal(false); }} className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-zinc-100">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{contact.avatar}</div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-none mb-1">{contact.name}</h3>
                    <p className="text-xs text-muted-foreground">{contact.handle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload}
        className="hidden" 
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
      />

      {/* Left Sidebar (Contacts list) */}
      <div className={`w-full md:w-[350px] border-r border-zinc-200 bg-white flex-col h-full shrink-0 ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
         
         {/* Header & Search */}
         <div className="p-4 border-b border-zinc-100">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Messages</h2>
             <button onClick={() => setShowNewChatModal(true)} className="p-2 text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
             </button>
           </div>
           
           <div className="relative">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search messages..." 
               className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium placeholder:text-muted-foreground"
             />
           </div>
         </div>

         {/* Contacts List */}
         <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
           {filteredContacts.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-center p-4">
               <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
               </div>
               <p className="text-sm font-bold text-foreground">No chats found</p>
               <p className="text-xs text-muted-foreground mt-1">Try searching for a different name</p>
             </div>
           ) : (
             filteredContacts.map(contact => (
               <div 
                 key={contact.id} 
                 onClick={() => { setActiveContactId(contact.id); setIsMobileChatOpen(true); }}
                 className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1
                   ${activeContactId === contact.id ? 'bg-primary/5 shadow-sm border border-primary/10' : 'hover:bg-zinc-100 border border-transparent'}`}
               >
                 <div className="relative shrink-0">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white
                     ${contact.id === 'c1' ? 'bg-indigo-500' : contact.id === 'c3' ? 'bg-emerald-500' : 'bg-primary'}`}>
                     {contact.avatar}
                   </div>
                   {contact.unread > 0 && (
                     <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
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
           )))}
         </div>
      </div>

      {/* Right Pane (Chat Window) */}
      <div className={`flex-1 flex-col h-full bg-[url('/chat-pattern.png')] bg-repeat bg-[length:400px_400px] bg-white ${isMobileChatOpen ? 'flex' : 'hidden md:flex'}`}>
         
         {/* Chat Header */}
         <div className="p-4 border-b border-zinc-100 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsMobileChatOpen(false)}
               className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-zinc-100 rounded-full transition-colors"
             >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </button>
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
               {activeContact.avatar}
             </div>
             <div>
               <h3 className="font-bold text-foreground leading-tight">{activeContact.name}</h3>
               <span className="text-xs text-muted-foreground font-medium">{activeContact.handle}</span>
             </div>
           </div>
           
           <div className="flex items-center gap-2 relative">
             <button onClick={() => setActiveCall('voice')} className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             </button>
             <button onClick={() => setActiveCall('video')} className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
             </button>
             
             {/* More Dropdown */}
             <div className="relative z-50">
               <button 
                 onClick={() => setShowTopMenu(!showTopMenu)} 
                 className="p-2.5 text-muted-foreground hover:bg-zinc-100 rounded-full transition-colors ml-2 relative z-50"
               >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
               </button>
               
               {showTopMenu && (
                 <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-100 shadow-xl rounded-2xl p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                   <button onClick={() => setShowTopMenu(false)} className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 rounded-xl text-sm font-bold text-zinc-700 transition-colors">
                     View Contact Info
                   </button>
                   <button onClick={() => setShowTopMenu(false)} className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 rounded-xl text-sm font-bold text-zinc-700 transition-colors">
                     Mute Notifications
                   </button>
                   <button onClick={() => setShowTopMenu(false)} className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 rounded-xl text-sm font-bold text-zinc-700 transition-colors">
                     Clear Chat
                   </button>
                   <div className="h-px bg-zinc-100 my-1 mx-2"></div>
                   <button onClick={() => setShowTopMenu(false)} className="w-full text-left px-4 py-2.5 hover:bg-red-50 rounded-xl text-sm font-bold text-red-600 transition-colors">
                     Block User
                   </button>
                 </div>
               )}
             </div>
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

         {/* Multiple Attachments Preview Area */}
         {attachments.length > 0 && (
           <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center gap-3 overflow-x-auto hide-scrollbar">
             {attachments.map((attachment, idx) => (
               <div key={idx} className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-2 py-1.5 shrink-0 shadow-sm animate-in zoom-in-95 duration-200">
                 <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                   {attachment.type === 'image' ? (
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                   ) : (
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                   )}
                 </div>
                 <div className="flex-1 min-w-[100px] max-w-[150px]">
                   <p className="text-xs font-bold text-foreground truncate">{attachment.name}</p>
                 </div>
                 <button onClick={() => removeAttachment(idx)} className="p-1 hover:bg-zinc-100 rounded-full text-zinc-500 transition-colors ml-1">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
               </div>
             ))}
           </div>
         )}

         {/* Message Input Area */}
         <div className="p-4 bg-white border-t border-zinc-100 shrink-0 relative">
           
           {showEmojiPicker && (
             <div className="absolute bottom-full left-4 mb-2 z-50 shadow-xl rounded-xl overflow-hidden border border-zinc-100">
               <EmojiPicker 
                 onEmojiClick={(emojiObject) => {
                   setMessageInput(prev => prev + emojiObject.emoji);
                 }}
               />
             </div>
           )}

           <div className={`flex items-end gap-2 border rounded-2xl p-2 transition-all shadow-sm ${
             isRecording ? 'bg-red-50 border-red-200 ring-2 ring-red-500/20' : 'bg-zinc-50 border-zinc-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary'
           }`}>
             
             {!isRecording && (
               <button 
                 onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); }}
                 className="p-2.5 text-muted-foreground hover:bg-zinc-200 hover:text-zinc-800 rounded-xl transition-colors shrink-0 mb-0.5"
               >
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
               </button>
             )}

             {isRecording ? (
               <div className="flex-1 flex items-center gap-3 px-3 py-3 h-full">
                 <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                 <span className="text-red-500 font-bold text-sm tracking-widest">{formatTime(recordingTime)}</span>
                 <span className="text-zinc-500 text-sm font-medium ml-2 animate-pulse">Recording audio...</span>
               </div>
             ) : (
               <textarea 
                 ref={textareaRef}
                 rows={1}
                 value={messageInput}
                 onChange={(e) => setMessageInput(e.target.value)}
                 onFocus={() => {
                   setShowEmojiPicker(false);
                   setShowAttachmentMenu(false);
                 }}
                 placeholder="Type a message..." 
                 className="w-full bg-transparent border-none outline-none resize-none text-foreground text-sm font-medium py-3 max-h-[120px] hide-scrollbar"
               />
             )}
             
             {showAttachmentMenu && !isRecording && (
               <div className="absolute bottom-full right-16 mb-2 z-50 bg-white shadow-xl rounded-2xl border border-zinc-100 p-2 w-48 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                 <button 
                   onClick={() => { fileInputRef.current?.click(); setShowAttachmentMenu(false); }}
                   className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 rounded-xl transition-colors text-sm font-semibold text-zinc-700 text-left"
                 >
                   <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                   </div>
                   Photos & Videos
                 </button>
                 <button 
                   onClick={() => { fileInputRef.current?.click(); setShowAttachmentMenu(false); }}
                   className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 rounded-xl transition-colors text-sm font-semibold text-zinc-700 text-left"
                 >
                   <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                   </div>
                   Document
                 </button>
                 <button 
                   onClick={() => { alert("Location sharing mocked!"); setShowAttachmentMenu(false); }}
                   className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 rounded-xl transition-colors text-sm font-semibold text-zinc-700 text-left"
                 >
                   <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                   </div>
                   Location
                 </button>
                 <button 
                   onClick={() => { alert("Contact sharing mocked!"); setShowAttachmentMenu(false); }}
                   className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 rounded-xl transition-colors text-sm font-semibold text-zinc-700 text-left"
                 >
                   <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                   </div>
                   Contact
                 </button>
               </div>
             )}

             {!isRecording && (
               <button 
                 onClick={(e) => { e.stopPropagation(); setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); }}
                 className="p-2.5 text-muted-foreground hover:bg-zinc-200 hover:text-zinc-800 rounded-xl transition-colors shrink-0 mb-0.5"
               >
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
               </button>
             )}
             
             {messageInput.trim() || attachments.length > 0 ? (
               <button onClick={handleSendMessage} className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shrink-0 mb-0.5 mr-0.5 active:scale-95">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
               </button>
             ) : (
               <button 
                 onClick={() => setIsRecording(!isRecording)}
                 className={`p-2.5 rounded-xl transition-all shadow-sm shrink-0 mb-0.5 mr-0.5 active:scale-95 ${
                   isRecording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary/10 text-primary hover:bg-primary/20'
                 }`}
               >
                 {isRecording ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                 ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                 )}
               </button>
             )}
           </div>
         </div>

      </div>
    </div>
  );
}
