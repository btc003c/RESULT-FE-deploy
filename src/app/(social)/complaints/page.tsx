"use client";

import { useState } from "react";

// Mock Data
const MOCK_TICKETS = [
  { id: "T-1001", title: "App crashing on video upload", status: "Open", date: "Oct 24, 2026", priority: "High", category: "Bug" },
  { id: "T-1002", title: "Feature request: Dark mode toggle", status: "Resolved", date: "Oct 20, 2026", priority: "Low", category: "Feature" },
  { id: "T-1003", title: "Unable to update profile picture", status: "Pending", date: "Oct 22, 2026", priority: "Medium", category: "Support" }
];

export default function ComplaintsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex-1 w-full max-w-[800px] mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Support & Feedback</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your support tickets and help us improve the platform.
          </p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-bold hover:bg-foreground/90 transition-all active:scale-95 shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Submit New Ticket
        </button>
      </div>

      {/* Stats/Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="text-sm font-semibold text-muted-foreground mb-1">Total Tickets</div>
          <div className="text-3xl font-bold text-foreground">12</div>
        </div>
        <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="text-sm font-semibold text-orange-600 mb-1">Open Issues</div>
          <div className="text-3xl font-bold text-orange-700">3</div>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="text-sm font-semibold text-emerald-600 mb-1">Resolved</div>
          <div className="text-3xl font-bold text-emerald-700">9</div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h2 className="font-bold text-lg text-foreground">Recent Tickets</h2>
          <button className="text-sm font-semibold text-primary hover:underline">View All</button>
        </div>
        
        <div className="divide-y divide-zinc-50">
          {MOCK_TICKETS.map(ticket => (
            <div key={ticket.id} className="p-5 hover:bg-zinc-50/80 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center gap-4">
               
               <div className="flex-1">
                 <div className="flex items-center gap-3 mb-1">
                   <span className="text-xs font-bold px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md">{ticket.id}</span>
                   <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{ticket.title}</h3>
                 </div>
                 <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                   <span className="flex items-center gap-1.5">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                     {ticket.date}
                   </span>
                   <span className="flex items-center gap-1.5">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                     {ticket.category}
                   </span>
                 </div>
               </div>

               <div className="flex items-center gap-3 md:w-[150px] justify-end">
                 {ticket.status === 'Open' && <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200">Open</span>}
                 {ticket.status === 'Resolved' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Resolved</span>}
                 {ticket.status === 'Pending' && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">Pending</span>}
                 <button className="p-2 text-zinc-400 hover:text-foreground hover:bg-zinc-100 rounded-full transition-colors hidden md:block">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                 </button>
               </div>

            </div>
          ))}
        </div>
      </div>

      {/* Simple Form Modal (Visual only) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Submit a Ticket</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-foreground mb-1.5">Subject</label>
                 <input type="text" placeholder="Brief description of the issue" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium" />
               </div>
               <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-sm font-bold text-foreground mb-1.5">Category</label>
                   <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
                     <option>Bug Report</option>
                     <option>Feature Request</option>
                     <option>Moderation</option>
                   </select>
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm font-bold text-foreground mb-1.5">Priority</label>
                   <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
                     <option>Normal</option>
                     <option>High</option>
                     <option>Urgent</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-bold text-foreground mb-1.5">Details</label>
                 <textarea rows={4} placeholder="Please provide more information..." className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none"></textarea>
               </div>
               <button onClick={() => setIsFormOpen(false)} className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] mt-2 shadow-lg shadow-primary/20">
                 Submit Ticket
               </button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
