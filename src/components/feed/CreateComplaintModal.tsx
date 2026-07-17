"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

interface CreateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function CreateComplaintModal({ isOpen, onClose, onPostCreated }: CreateComplaintModalProps) {
  // Text & Characters
  const [postText, setPostText] = useState("");
  const maxChars = 1000;
  
  // Settings
  const [priority, setPriority] = useState("High");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Media Upload (Multiple)
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_MEDIA = 4;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Clear media when closed
      mediaPreviews.forEach(url => URL.revokeObjectURL(url));
      setMediaPreviews([]);
      setPostText("");
      setPriority("High");
      setIsAnonymous(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const availableSlots = MAX_MEDIA - mediaPreviews.length;
      const filesToAdd = files.slice(0, availableSlots);
      
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setMediaPreviews(prev => [...prev, ...newPreviews]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    URL.revokeObjectURL(mediaPreviews[indexToRemove]);
    setMediaPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const isOverLimit = postText.length > maxChars;

  const getMediaGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2"; 
    if (count >= 4) return "grid-cols-2 grid-rows-2";
    return "grid-cols-1";
  };

  const handleSubmit = async () => {
    if (postText.trim().length === 0 || isOverLimit) return;
    
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      const requestData = {
        title: postText.substring(0, 100),
        description: postText,
        category: priority,
        locationName: "General",
        isAnonymous: isAnonymous,
      };
      formData.append("data", JSON.stringify(requestData));
      
      if (fileInputRef.current?.files) {
        Array.from(fileInputRef.current.files).forEach(file => {
          formData.append("files", file);
        });
      }
      
      await api.complaints.create(formData);
      
      onClose();
      if (onPostCreated) onPostCreated();
      
    } catch (error) {
      console.error("Failed to create complaint", error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      
      {/* Modal Container */}
      <div className="bg-background w-full max-w-[600px] rounded-2xl shadow-2xl border border-red-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-muted bg-red-50/30">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-foreground">Report an Issue</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Share your experience to warn others.</p>
          </div>
          <button onClick={onClose} aria-label="Close Modal" className="p-2 -mr-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1 hide-scrollbar">
           
            {/* Text Area */}
            <textarea 
              autoFocus
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What happened? Describe the issue in detail..."
              className={`w-full resize-none bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground min-h-[160px] transition-colors ${isOverLimit ? 'text-danger' : 'text-foreground'}`}
              aria-label="Complaint Body"
            />
            
            {/* Global Media Preview - Multiple Grid Layout */}
            {mediaPreviews.length > 0 && (
              <div className={`grid gap-2 mb-4 animate-in fade-in zoom-in-95 duration-200 ${getMediaGridClass(mediaPreviews.length)}`}>
                {mediaPreviews.map((preview, index) => (
                  <div 
                    key={preview} 
                    className={`relative w-full h-full min-h-[150px] max-h-[300px] overflow-hidden rounded-xl border border-muted ${
                      mediaPreviews.length === 3 && index === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  >
                    <img 
                      src={preview} 
                      alt={`Upload preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-2 right-2 p-1.5 bg-foreground/50 hover:bg-foreground backdrop-blur-md rounded-full text-background transition-colors"
                      aria-label="Remove media"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Settings Toggles */}
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isAnonymous ? 'bg-red-500 border-red-500' : 'bg-transparent border-muted group-hover:border-red-300'}`}>
                   {isAnonymous && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
                Post Anonymously
              </label>
            </div>
            
            <input 
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-muted bg-background/50 backdrop-blur-sm flex items-center justify-between">
           
           {/* Left Actions */}
           <div className="flex items-center gap-1">
             <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={mediaPreviews.length >= MAX_MEDIA}
                className="p-2.5 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                aria-label="Add Media"
                title="Add Media"
             >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
             </button>
           </div>
           
           {/* Right Actions */}
           <div className="flex items-center gap-4">
             {/* Character Count */}
             <div className="flex items-center gap-2 border-r border-muted pr-4 hidden sm:flex">
                <svg className="w-6 h-6 transform -rotate-90">
                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-muted" />
                   <circle 
                      cx="12" cy="12" r="10" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      fill="transparent" 
                      strokeDasharray={`${(postText.length / maxChars) * 62.8} 62.8`} 
                      className={`transition-all duration-300 ${isOverLimit ? 'text-danger' : postText.length > maxChars * 0.8 ? 'text-warning' : 'text-red-500'}`} 
                   />
                </svg>
                <span className={`text-xs font-bold ${isOverLimit ? 'text-danger' : 'text-muted-foreground'}`}>
                  {postText.length}/{maxChars}
                </span>
             </div>
             
             {/* Submit Button */}
             <button 
               onClick={handleSubmit}
               disabled={postText.trim().length === 0 || isOverLimit || isSubmitting}
               className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600 flex items-center gap-2 shadow-md shadow-red-500/20"
             >
               {isSubmitting ? (
                 <>
                   <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Submitting...
                 </>
               ) : (
                 "Submit Complaint"
               )}
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
