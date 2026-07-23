"use client";

import { useState, useEffect, useRef } from "react";

type PostType = "UPDATE" | "CLIPS" | "POLL" | "LIVE" | "FLASH" | "COMPLAINT";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: PostType;
  onPostCreated?: () => void;
}

export default function CreatePostModal({ isOpen, onClose, defaultType = "UPDATE", onPostCreated }: CreatePostModalProps) {
  const [activeTab, setActiveTab] = useState<PostType>(defaultType);
  const [pollOptions, setPollOptions] = useState(["", ""]);

  // Text & Characters
  const [postText, setPostText] = useState("");
  const maxChars = 500;

  // Audience
  const [audience, setAudience] = useState("Public");
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);
  const audienceOptions = ["Public", "Verified Users", "Organizations Only"];

  const [user, setUser] = useState<any>(null);

  // Complaint Settings
  const [priority, setPriority] = useState("Normal");
  const [locationName, setLocationName] = useState("");
  const [targetDepartment, setTargetDepartment] = useState("");

  // Poll Settings
  const [allowMultiVote, setAllowMultiVote] = useState(false);

  // Media Upload (Multiple)
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_MEDIA = 4;

  const audienceRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('rh_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset state if needed when opened
    } else {
      document.body.style.overflow = "unset";
      // Clear media when closed
      mediaPreviews.forEach(url => URL.revokeObjectURL(url));
      setMediaPreviews([]);
      setScheduledDate(null);
      setIsDatePickerOpen(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (audienceRef.current && !audienceRef.current.contains(event.target as Node)) {
        setIsAudienceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Calculate how many more we can add
      const availableSlots = MAX_MEDIA - mediaPreviews.length;
      const filesToAdd = files.slice(0, availableSlots);

      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setMediaPreviews(prev => [...prev, ...newPreviews]);

      // Reset input value so the same file can be selected again if removed
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

  // Compute grid layout classes for media
  const getMediaGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2"; // First gets col-span-2, others get 1
    if (count >= 4) return "grid-cols-2 grid-rows-2";
    return "grid-cols-1";
  };

  const handleSubmit = async () => {
    if (postText.trim().length === 0 || isOverLimit) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      const { api } = await import('@/lib/api');

      if (activeTab === "UPDATE" || activeTab === "CLIPS" || activeTab === "LIVE" || activeTab === "FLASH") {
        let postType = "UPDATE";
        if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
          const firstFile = fileInputRef.current.files[0];
          if (firstFile.type.startsWith('video/')) postType = "VIDEO";
          else postType = "IMAGE";
        }

        const requestData = {
          postType: postType,
          text: postText,
          category: null,
          locationName: null,
          scheduledFor: scheduledDate || null
        };
        formData.append("data", JSON.stringify(requestData));

        if (fileInputRef.current?.files) {
          Array.from(fileInputRef.current.files).forEach(file => {
            formData.append("files", file);
          });
        }
        await api.posts.create(formData);

      } else if ((activeTab as string) === "COMPLAINT") {
        const requestData = {
          title: postText.substring(0, 100),
          description: postText,
          category: priority,
          locationName: locationName || "General",
          isAnonymous: audience === "Public" ? false : true,
        };
        formData.append("data", JSON.stringify(requestData));

        if (fileInputRef.current?.files) {
          Array.from(fileInputRef.current.files).forEach(file => {
            formData.append("files", file);
          });
        }
        await api.complaints.create(formData);

      } else if (activeTab === "POLL") {
        const requestData = {
          title: postText.substring(0, 100),
          description: postText,
          visibility: audience === "Public" ? "PUBLIC" : "PRIVATE",
          accessCode: null,
          allowAnonymous: audience === "Public" ? false : true,
          endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          linkedWorkspaceId: null,
          hideResultsUntilEnd: false,
          options: pollOptions.filter(o => o.trim())
        };
        await api.votes.create(requestData);
      }

      // Reset form
      setPostText("");
      setPollOptions(["", ""]);
      setMediaPreviews([]);
      setLocationName("");
      setTargetDepartment("");
      setScheduledDate(null);
      setIsDatePickerOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';

      onClose();
      if (onPostCreated) onPostCreated();

    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >

      {/* Modal Container */}
      <div className="bg-background w-full max-w-[600px] rounded-2xl shadow-2xl border border-muted flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-muted">
          <h2 id="modal-title" className="text-xl font-bold text-foreground">Create a post</h2>
          <button onClick={onClose} aria-label="Close Modal" className="p-2 -mr-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-4 flex gap-4 items-center">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 text-xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h4 className="font-bold text-lg text-foreground leading-tight mb-1">{user?.name || 'User'}</h4>

            {/* Audience Dropdown */}
            <div className="relative" ref={audienceRef}>
              <button
                onClick={() => setIsAudienceOpen(!isAudienceOpen)}
                aria-haspopup="listbox"
                aria-expanded={isAudienceOpen}
                className="flex items-center gap-1 border border-muted rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-muted transition-colors text-primary bg-primary/5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                {audience}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${isAudienceOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>

              {isAudienceOpen && (
                <ul
                  role="listbox"
                  className="absolute left-0 mt-2 w-48 bg-background border border-muted rounded-xl shadow-lg z-20 py-2 animate-in fade-in slide-in-from-top-2"
                >
                  {audienceOptions.map(opt => (
                    <li
                      key={opt}
                      role="option"
                      aria-selected={audience === opt}
                      onClick={() => { setAudience(opt); setIsAudienceOpen(false); }}
                      className={`px-4 py-2 text-sm font-medium cursor-pointer hover:bg-muted ${audience === opt ? 'text-primary bg-primary/5' : 'text-foreground'}`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-2 overflow-y-auto flex-1 hide-scrollbar">

          {/* Text Area (Common to all) */}
          <textarea
            autoFocus
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={
              activeTab === "UPDATE" ? "What do you want to talk about?" :
                activeTab === "CLIPS" ? "Share a quick moment..." :
                  activeTab === "POLL" ? "Ask a question..." :
                    activeTab === "LIVE" ? "What's this stream about?" :
                      activeTab === "COMPLAINT" ? "Describe the issue or complaint in detail..." :
                      "Share a flash update..."
            }
            className={`w-full resize-none bg-transparent border-none outline-none text-xl placeholder:text-muted-foreground min-h-[140px] transition-colors ${isOverLimit ? 'text-danger' : 'text-foreground'}`}
            aria-label="Post Body"
          />

          {/* Hidden Global File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />

          {/* Global Media Preview - Multiple Grid Layout */}
          {mediaPreviews.length > 0 && (
            <div className={`grid gap-2 mb-4 animate-in fade-in zoom-in-95 duration-200 ${getMediaGridClass(mediaPreviews.length)}`}>
              {mediaPreviews.map((preview, index) => (
                <div
                  key={preview}
                  className={`relative w-full h-full min-h-[150px] max-h-[300px] overflow-hidden rounded-xl border border-muted ${mediaPreviews.length === 3 && index === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                >
                  <img
                    src={preview}
                    alt={`Media preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute top-2 right-2 p-1.5 bg-foreground/70 hover:bg-foreground text-background rounded-full transition-colors backdrop-blur-sm z-10"
                    aria-label="Remove media"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Update (Post) Specific Fields */}
          {activeTab === "UPDATE" && (
            <div className="flex gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 rounded-2xl transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary mb-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span className="font-bold text-foreground">Media</span>
              </div>
              <button className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 rounded-2xl transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary mb-2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span className="font-bold text-foreground">Link</span>
              </button>
            </div>
          )}

          {/* Clips Specific Fields */}
          {activeTab === "CLIPS" && (
            <div className="flex gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex-1 flex flex-col items-center justify-center p-6 border border-red-200 rounded-xl bg-red-50 relative overflow-hidden">
                {/* Vibrant red decorative banner element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-rose-600"></div>
                <div className="flex items-center gap-2 mb-4 text-red-600 font-bold">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  Vertical Short
                </div>
                <button className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors text-sm shadow-md shadow-red-500/20 active:scale-95">
                  Upload Video
                </button>
              </div>
            </div>
          )}

          {/* Live Specific Fields */}
          {activeTab === "LIVE" && (
            <div className="flex gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
              <button className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted hover:border-emerald-500 hover:bg-emerald-500/5 rounded-2xl transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 mb-2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                <span className="font-bold text-foreground">Live Video</span>
              </button>
              <button className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted hover:border-emerald-500 hover:bg-emerald-500/5 rounded-2xl transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500 mb-2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                <span className="font-bold text-foreground">Shorts</span>
              </button>
            </div>
          )}

          {/* Flash Specific Fields */}
          {activeTab === "FLASH" && (
            <div className="flex gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
              <button className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted hover:border-purple-500 hover:bg-purple-500/5 rounded-2xl transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500 mb-2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <span className="font-bold text-foreground text-sm">Photo</span>
              </button>
              <button className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted hover:border-purple-500 hover:bg-purple-500/5 rounded-2xl transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500 mb-2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                <span className="font-bold text-foreground text-sm">Video</span>
              </button>
              <button className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-muted hover:border-purple-500 hover:bg-purple-500/5 rounded-2xl transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500 mb-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                <span className="font-bold text-foreground text-sm">Promo</span>
              </button>
            </div>
          )}

          {/* Complaint (CV) Specific Fields */}
          {activeTab === "COMPLAINT" && (
            <div className="flex gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-red-200 hover:border-red-500 hover:bg-red-500/5 rounded-2xl transition-colors cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400 group-hover:text-red-500 mb-2 transition-colors"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span className="font-bold text-foreground">Attach Evidence (Photo/Video)</span>
              </div>
            </div>
          )}

          {/* Poll Specific Fields */}
          {activeTab === "POLL" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 mb-4">
              <div className="border border-muted rounded-xl p-5 bg-muted/10">
                <h4 className="font-bold text-foreground mb-2">Poll Options</h4>
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="flex-1 flex items-center border border-muted rounded-xl px-4 py-3 bg-background focus-within:border-accent">
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        aria-label={`Poll Option ${i + 1}`}
                        onChange={(e) => {
                          const newOpts = [...pollOptions];
                          newOpts[i] = e.target.value;
                          setPollOptions(newOpts);
                        }}
                        className="bg-transparent border-none outline-none w-full text-base font-medium text-foreground"
                      />
                    </div>
                    {i >= 2 && (
                      <button onClick={() => handleRemoveOption(i)} aria-label={`Remove option ${i + 1}`} className="p-3 text-danger hover:bg-danger/10 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 5 && (
                  <button onClick={handleAddOption} type="button" className="text-accent font-bold text-sm flex items-center gap-1.5 hover:underline mt-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Option
                  </button>
                )}

                <div className="border-t border-muted pt-4 mt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Poll Duration</span>
                    <select aria-label="Poll Duration" className="bg-background border border-muted px-3 py-1.5 rounded-lg text-sm font-bold outline-none cursor-pointer text-foreground hover:bg-muted/50 transition-colors">
                      <option>1 Day</option>
                      <option>3 Days</option>
                      <option>7 Days</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Allow multiple choices</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={allowMultiVote}
                      onClick={() => setAllowMultiVote(!allowMultiVote)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${allowMultiVote ? 'bg-accent' : 'bg-muted-foreground/30'}`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${allowMultiVote ? 'translate-x-5' : ''}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Date Picker Overlay */}
        {isDatePickerOpen && (
          <div className="px-6 pb-4 border-t border-muted bg-muted/5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between py-3">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Schedule Post
              </h4>
              <button onClick={() => setIsDatePickerOpen(false)} className="p-1 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="flex gap-4">
              <input 
                type="datetime-local" 
                className="bg-background border border-muted px-4 py-2 rounded-xl text-sm font-semibold text-foreground outline-none focus:border-primary flex-1 transition-colors"
                onChange={(e) => setScheduledDate(e.target.value)}
                value={scheduledDate || ""}
              />
              {scheduledDate && (
                <button onClick={() => setScheduledDate(null)} className="px-4 py-2 bg-danger/10 text-danger font-bold rounded-xl text-sm hover:bg-danger hover:text-white transition-colors">
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-muted bg-background/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("UPDATE")}
              aria-pressed={activeTab === "UPDATE"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-semibold text-sm ${activeTab === "UPDATE" ? "bg-blue-500/10 text-blue-600" : "text-muted-foreground hover:bg-muted"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
              <span className="hidden sm:inline">Post</span>
            </button>
            <button
              onClick={() => setActiveTab("CLIPS")}
              aria-pressed={activeTab === "CLIPS"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-semibold text-sm ${activeTab === "CLIPS" ? "bg-red-500/10 text-red-600" : "text-muted-foreground hover:bg-muted"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              <span className="hidden sm:inline">Clips</span>
            </button>
            <button
              onClick={() => setActiveTab("POLL")}
              aria-pressed={activeTab === "POLL"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-semibold text-sm ${activeTab === "POLL" ? "bg-amber-500/10 text-amber-600" : "text-muted-foreground hover:bg-muted"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
              <span className="hidden sm:inline">Poll</span>
            </button>
            <button
              onClick={() => setActiveTab("LIVE")}
              aria-pressed={activeTab === "LIVE"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-semibold text-sm ${activeTab === "LIVE" ? "bg-emerald-500/10 text-emerald-600" : "text-muted-foreground hover:bg-muted"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3" fill="currentColor"></circle></svg>
              <span className="hidden sm:inline">Live</span>
            </button>
            <button
              onClick={() => setActiveTab("FLASH")}
              aria-pressed={activeTab === "FLASH"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-semibold text-sm ${activeTab === "FLASH" ? "bg-purple-500/10 text-purple-600" : "text-muted-foreground hover:bg-muted"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span className="hidden sm:inline">Flash</span>
            </button>
            <button
              onClick={() => setActiveTab("COMPLAINT")}
              aria-pressed={activeTab === "COMPLAINT"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-semibold text-sm ${activeTab === "COMPLAINT" ? "bg-orange-500/10 text-orange-600" : "text-muted-foreground hover:bg-muted"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                <path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path>
              </svg>
              <span className="hidden sm:inline">CV</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Schedule Button (Hidden for Complaints) */}
            {activeTab !== "COMPLAINT" && (
              <button 
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`p-2 rounded-full transition-colors ${scheduledDate ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                title="Schedule Post"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </button>
            )}

            {/* Character Counter */}
            <div className={`text-sm font-medium ${isOverLimit ? 'text-danger' : 'text-muted-foreground'}`}>
              {postText.length} / {maxChars}
            </div>

            {/* Circular Progress (Visual only) */}
            <div className="relative w-6 h-6 hidden sm:block">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-muted/50" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path
                  className={isOverLimit ? "text-danger" : "text-primary"}
                  strokeDasharray={`${Math.min((postText.length / maxChars) * 100, 100)}, 100`}
                  strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>

            <button
              onClick={handleSubmit}
              disabled={postText.trim().length === 0 || isOverLimit || isSubmitting}
              aria-disabled={postText.trim().length === 0 || isOverLimit || isSubmitting}
              className={`px-6 py-2.5 rounded-full font-bold text-white transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:active:scale-100 ${scheduledDate ? 'bg-primary hover:bg-primary/90' : 'bg-foreground hover:bg-foreground/90 disabled:hover:bg-foreground'}`}
            >
              {isSubmitting ? "Processing..." : scheduledDate ? "Schedule" : "Post"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
