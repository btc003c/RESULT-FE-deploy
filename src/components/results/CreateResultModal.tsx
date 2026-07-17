"use client";

import { useState, useEffect } from "react";
import { X, Upload, CheckCircle2, Activity } from 'lucide-react';

export default function CreateResultModal({ 
  isOpen, 
  onClose,
  accessType = 'OPEN' 
}: { 
  isOpen: boolean, 
  onClose: () => void,
  accessType?: string 
}) {
  const [resultType, setResultType] = useState("SCORE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-[#FFC82A]/10 flex items-center justify-center text-[#FFC82A]">
               <Activity size={16} strokeWidth={3} />
             </div>
             <h2 className="text-lg font-black text-zinc-900 tracking-tight">Create Result</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 rounded-full transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          
          {/* Type Selector */}
          <div>
            <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-3">Result Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
               {["SCORE", "POLITICS", "EDUCATION", "OTHER"].map(type => (
                 <button 
                   key={type}
                   onClick={() => setResultType(type)}
                   className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                     resultType === type 
                       ? "border-[#FFC82A] bg-[#FFC82A]/5 text-[#FFC82A]" 
                       : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"
                   }`}
                 >
                   {type}
                 </button>
               ))}
            </div>
          </div>

          {/* Conditional Fields based on accessType */}
          {accessType === 'CLOSED' ? (
            <>
              {/* College / Organization ID */}
              <div>
                <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-3">College / Organization ID</label>
                <input 
                  type="text" 
                  placeholder="E.g., COLL-1092"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#FFC82A] focus:ring-1 focus:ring-[#FFC82A] transition-all"
                />
              </div>

              {/* Roll Number / Access Code */}
              <div>
                <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-3">Roll Number / Access Code</label>
                <input 
                  type="text"
                  placeholder="E.g., 849201"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#FFC82A] focus:ring-1 focus:ring-[#FFC82A] transition-all"
                />
              </div>
            </>
          ) : (
            <>
              {/* Public Announcement Title */}
              <div>
                <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-3">Result Title / Announcement</label>
                <input 
                  type="text" 
                  placeholder="E.g., Q3 Company Turnover Released"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#FFC82A] focus:ring-1 focus:ring-[#FFC82A] transition-all"
                />
              </div>

              {/* Public Details */}
              <div>
                <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-wider mb-3">Public Details & Data</label>
                <textarea 
                  placeholder="Enter the public specifics, numbers, or outcomes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#FFC82A] focus:ring-1 focus:ring-[#FFC82A] transition-all min-h-[120px] resize-y"
                />
              </div>
            </>
          )}

          {/* Upload Placeholder */}
          <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-zinc-50/50 cursor-pointer hover:bg-zinc-50 transition-colors group">
             <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-[#FFC82A] transition-colors mb-3">
                <Upload size={20} strokeWidth={2.5} />
             </div>
             <p className="text-sm font-bold text-zinc-700">Attach Data File or Image</p>
             <p className="text-[11px] font-medium text-zinc-400 mt-1">CSV, JSON, JPG, or PNG (Max 10MB)</p>
          </div>
          
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              setIsSubmitting(true);
              setTimeout(() => { setIsSubmitting(false); onClose(); }, 1000);
            }}
            disabled={!title || isSubmitting}
            className="px-8 py-3 bg-[#FFC82A] hover:bg-[#E5B426] text-white font-bold rounded-xl shadow-md shadow-[#FFC82A]/20 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Publishing...</span>
            ) : (
              <>
                <CheckCircle2 size={18} strokeWidth={2.5} />
                Publish Result
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
