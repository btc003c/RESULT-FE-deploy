"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/lib/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Search, MapPin, AlertCircle, Building2, Database, FileText, ArrowUpDown, ChevronDown, CheckCircle2, User, LayoutGrid, MessagesSquare } from "lucide-react";

// Unified Filters
const FILTERS = [
  { id: "all", label: "All", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: "users", label: "People", icon: <User className="w-4 h-4" /> },
  { id: "posts", label: "Posts", icon: <MessagesSquare className="w-4 h-4" /> },
  { id: "workspaces", label: "Organizations", icon: <Building2 className="w-4 h-4" /> },
  { id: "datasets", label: "Datasets", icon: <Database className="w-4 h-4" /> },
  { id: "complaints", label: "Complaints", icon: <AlertCircle className="w-4 h-4" /> }
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const response = await api.search.global(debouncedQuery);
        setResults(response.content || []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Filtering Logic
  let filteredResults = results;
  if (activeFilter !== "all") {
    const mapFilterToType: Record<string, string> = {
      users: "USER",
      posts: "POST",
      workspaces: "WORKSPACE",
      datasets: "DATASET",
      complaints: "COMPLAINT"
    };
    filteredResults = results.filter(r => r.type === mapFilterToType[activeFilter]);
  }

  // Sorting Logic
  if (sortBy === 'newest') {
    filteredResults.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } else if (sortBy === 'oldest') {
    filteredResults.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Search Header - Sticky */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="p-4 sm:px-6 pt-6 max-w-4xl mx-auto">
          {/* Main Search Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across BindTime..."
              className="w-full h-14 pl-12 pr-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition-all text-base font-medium shadow-sm"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center justify-between mt-4">
            {/* Scrollable Filters */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 pr-4">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    activeFilter === f.id
                      ? "bg-zinc-900 text-white shadow-md"
                      : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
                  }`}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative hidden sm:block shrink-0">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-zinc-50 border border-zinc-200 text-zinc-600 text-sm font-bold rounded-xl px-4 py-2 pr-8 outline-none hover:bg-zinc-100 transition-colors focus:border-zinc-300"
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:px-6">
        {/* Empty / Explore State */}
        {!searchQuery && results.length === 0 && !isSearching && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-yellow-50 rounded-3xl flex items-center justify-center mb-6 border border-yellow-100 shadow-sm">
              <Search className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">Explore BindTime</h2>
            <p className="text-zinc-500 max-w-sm font-medium mb-8">
              Search for friends, discover amazing workspaces, access rich datasets, or browse public complaints.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mr-2">Trending</span>
              {['Tech Campus', 'AI Datasets', 'Network Issues', 'Data Science'].map((tag) => (
                <button key={tag} onClick={() => setSearchQuery(tag)} className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-bold text-zinc-600 hover:bg-zinc-100 transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Searching State */}
        {isSearching && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-yellow-500 animate-spin" />
          </div>
        )}

        {/* Results */}
        {!isSearching && searchQuery && filteredResults.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 font-medium">No results found for "{searchQuery}"</p>
          </div>
        )}

        {/* Result List */}
        {!isSearching && filteredResults.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="text-sm font-bold text-zinc-400 mb-2">
              Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
            </div>
            
            {filteredResults.map((result, idx) => (
              <div 
                key={result.id || idx} 
                className="group bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-md transition-all duration-200"
              >
                {/* USER RESULT */}
                {result.type === 'USER' && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                      <span className="text-white font-black text-lg">{result.title?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/profile/${result.id}`} className="font-bold text-zinc-900 text-lg hover:underline truncate">
                          {result.title}
                        </Link>
                        {result.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                      </div>
                      <p className="text-sm text-zinc-500 truncate mt-0.5">{result.description}</p>
                    </div>
                  </div>
                )}

                {/* POST RESULT */}
                {result.type === 'POST' && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-zinc-500" />
                      </div>
                      <span className="font-bold text-sm text-zinc-700">Author Name</span>
                      <span className="text-xs text-zinc-400">• {result.createdAt ? formatDistanceToNow(new Date(result.createdAt)) : 'recently'}</span>
                    </div>
                    <p className="text-zinc-800 text-base leading-relaxed line-clamp-3 font-medium">
                      {result.title || result.description}
                    </p>
                  </div>
                )}

                {/* WORKSPACE RESULT */}
                {result.type === 'WORKSPACE' && (
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Building2 className="w-6 h-6 text-zinc-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-lg text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{result.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">
                          Workspace
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DATASET RESULT */}
                {result.type === 'DATASET' && (
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Database className="w-6 h-6 text-zinc-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-lg text-zinc-900 group-hover:text-emerald-600 transition-colors truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{result.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                          Dataset
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* COMPLAINT RESULT */}
                {result.type === 'COMPLAINT' && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-zinc-900 truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{result.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                          Complaint
                        </span>
                        {result.metadata?.location && (
                          <span className="flex items-center gap-1 text-xs font-medium text-zinc-500">
                            <MapPin className="w-3 h-3" /> {result.metadata.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-yellow-500 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
